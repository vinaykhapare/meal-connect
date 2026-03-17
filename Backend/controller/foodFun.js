const express = require("express");
const mongoose = require("mongoose");

const FOOD = require("../models/foodModel");

async function getFoodList(req, res) {
    try {
        const availableFood = await FOOD.find({ status: "Picked Up" });
        res.status(200).json(availableFood);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getFoodListByid(req, res) {
    try {
        const { foodId } = req.params;
        const food = await FOOD.findById(foodId);
        if (!food) return res.status(404).json({ message: "Food item not found" });
        res.status(200).json(food);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function donateFood(req, res){
    try {
        const { donorId, foodDetails,  } = req.body;

        // Validate required fields
        if (!donorId || !foodDetails || !foodDetails.foodType || !foodDetails.possibleServes || !foodDetails.foodDescription || !foodDetails.expiryTime) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create new food donation entry
        const newDonation = new FOOD({
            donorId,
            receiverId: null, // Optional field
            foodDetails: {
                foodType: foodDetails.foodType,
                possibleServes: foodDetails.possibleServes,
                foodDescription: foodDetails.foodDescription,
                expiryTime: foodDetails.expiryTime
            },
            status: "Available" // Default status is "Available"
        });

        // Save to MongoDB
        await newDonation.save();

        res.status(201).json({ message: "Food donation saved successfully", donation: newDonation });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error, please try again later" });
    }
}

async function updateStatus(req, res) {
    try {
        const id = req.user._id;
        const { foodId } = req.params;
        const food = await FOOD.findById(foodId);
        if (!food) return res.status(404).json({ message: "Food item not found" });
        const updateData = {
            receiverId : id,
            status : "Picked Up"
        };
        const updatedFood = await FOOD.findOneAndUpdate(
            { _id: foodId },
            updateData,
            { new: true }
        );
        if (!updatedFood) return res.status(404).json({ message: "Receiver not found" });
        res.status(200).json(updatedFood);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getUserDonations = async (req, res) => {
    try {
        // Get user ID from authenticated request
        const donorId = req.user._id;
        
        const donations = await FOOD.find({ donorId })
            .sort({ date: -1 }) // Sort by date descending
            .select('_id name phone date totalCount status address foodType expiryTime pincode qrCodeDataUrl'); // Include all fields needed by dashboard

        res.status(200).json({
            success: true,
            data: donations
        });
    } catch (error) {
        console.error('Error fetching user donations:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const createFood = async (req, res) => {
    try {
        const { name, phone, totalCount, address, foodType, description } = req.body;
        const donorId = req.user._id; // Get donor ID from authenticated request

        // Create new donation
        const donation = await FOOD.create({
            donorId,
            name,
            phone,
            totalCount,
            address,
            foodType,
            description,
            date: new Date(),
            status: 'Pending'
        });

        res.status(201).json({
            success: true,
            message: 'Donation registered successfully',
            data: donation
        });
    } catch (error) {
        console.error('Error in createFood:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateDonationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find donation and check ownership
        const donation = await FOOD.findOne({ _id: id, donorId: req.user._id });

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found or unauthorized'
            });
        }

        donation.status = status;
        await donation.save();

        res.status(200).json({
            success: true,
            data: donation
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

async function createFoodDonation(req, res) {
    try {
        const {
            name,
            phone,
            totalCount,
            address,
            foodType,
            description,
            pincode,
            expiryTime
        } = req.body;

        console.log('Received donation data:', req.body);

        // 1. Create the donation first so we have an _id for the QR payload
        const donation = await FOOD.create({
            donorId: req.user._id,
            name,
            phone,
            totalCount,
            address,
            foodType,
            description,
            pincode,
            expiryTime,
            status: 'Pending'
        });

        // 2. Generate a cryptographically secure unique token
        const crypto = require('crypto');
        const QRCode = require('qrcode');

        const qrToken = crypto.randomBytes(32).toString('hex');

        // 3. Build compact, secure QR payload
        const qrPayload = JSON.stringify({
            donationId: donation._id.toString(),
            token: qrToken,
        });

        // 4. Render payload as a base64 PNG data URL
        const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 300,
        });

        // 5. Persist token + QR image — token is the secret, QR is the visual
        donation.qrToken = qrToken;
        donation.qrCodeDataUrl = qrCodeDataUrl;
        await donation.save();

        res.status(201).json({
            success: true,
            message: 'Food donation created successfully',
            data: donation,
            qrCodeDataUrl,  // returned so frontend can display QR immediately
        });

    } catch (error) {
        console.error('Error creating food donation:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getFoodList,
    getFoodListByid,
    donateFood,
    updateStatus,
    getUserDonations,
    createFood,
    updateDonationStatus,
    createFoodDonation
};
