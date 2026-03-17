const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DONOR = require("../middleware/donorModel.js");
const FOOD = require("../models/foodModel.js");
const { generateJWT } = require("./generateJWT.js");

async function getProfile(req, res) {
  try {
    const donor = await DONOR.findById(req.user._id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    res.status(200).json({
      success: true,
      donor: {
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        location: donor.location,
        pincode: donor.pincode,
        foodSource: donor.foodSource,
      },
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: err.message,
    });
  }
}

async function donorLogin(req, res) {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email); // Debug log

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find donor by email
    const donor = await DONOR.findOne({ email });
    console.log("Found donor:", donor); // Debug log

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Account not found. Please check your email or sign up.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, donor.password);
    console.log("Password match:", isMatch); // Debug log

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT and send response
    const token = jwt.sign(
      { _id: donor._id, email: donor.email },
      "yourSecretKey",
      { expiresIn: "24h" },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: donor._id,
        name: donor.name,
        email: donor.email,
        role: 'user',
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
}

async function donorResgister(req, res) {
  try {
    const { name, phone, location, password, email, pincode } = req.body;

    // Check if email already exists
    const existingDonor = await DONOR.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDonor = new DONOR({
      name,
      phone,
      email,
      location,
      pincode,
      password: hashedPassword,
      is_donor: true,
    });

    await newDonor.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      message: "Error during registration",
      error: err.message,
    });
  }
}

async function updateProfile(req, res) {
  try {
    const donorId = req.user._id;
    const updateData = req.body;

    const donor = await DONOR.findByIdAndUpdate(
      donorId,
      { $set: updateData },
      { new: true },
    );

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      donor: {
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        location: donor.location,
        pincode: donor.pincode,
        foodSource: donor.foodSource,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
}

module.exports = {
  getProfile,
  donorLogin,
  donorResgister,
  updateProfile,
};
