const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const RECEIVER = require("../models/receiverModel");
const FOOD = require("../models/foodModel");
const { generateJWT } = require("./generateJWT.js");

async function getReceiverProfile(req, res) {
  try {
    const receiver = await RECEIVER.findById(req.user._id).select("-password");

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const pincodePrefix = String(receiver.pincode || "").slice(0, 4);

    // Fetch donations that are linked to this NGO directly (receiverId),
    // OR donations in the same pincode area that are no longer Pending
    // (covers old documents created before receiverId field existed)
    const donations = await FOOD.find({
      $or: [
        { receiverId: req.user._id },
        { "statusHistory.updatedBy": req.user._id },
        {
          pincode: { $regex: `^${pincodePrefix}` },
          status: { $in: ["Accepted", "Completed", "Cancelled"] },
        },
      ],
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: {
        receiver,
        donations,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function receiverLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const receiver = await RECEIVER.findOne({ email });

    if (!receiver) {
      return res.status(401).json({
        success: false,
        message: "Account not found with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, receiver.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (receiver.verificationStatus.status === "Pending") {
      return res.status(403).json({
        success: false,
        message:
          "Your account is pending verification. Please wait for admin approval.",
        verificationStatus: "Pending",
      });
    }

    if (receiver.verificationStatus.status === "Rejected") {
      return res.status(403).json({
        success: false,
        message:
          receiver.verificationStatus.message ||
          "Your registration was rejected",
        verificationStatus: "Rejected",
      });
    }

    const token = jwt.sign(
      {
        _id: receiver._id,
        email: receiver.email,
        role: "ngo",
        name: receiver.name,
      },
      "yourSecretKey",
      { expiresIn: "24h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: receiver._id,
        name: receiver.name,
        email: receiver.email,
        role: "ngo",
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

async function receiverRegister(req, res) {
  try {
    const {
      name,
      email,
      ngoDarpanID,
      location,
      description,
      pincode,
      leader,
      password,
    } = req.body;

    const existingReceiver = await RECEIVER.findOne({
      $or: [{ email }, { ngoDarpanID }],
    });

    if (existingReceiver) {
      return res.status(400).json({
        success: false,
        message: "NGO already registered with this email or Darpan ID",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await RECEIVER.create({
      name,
      email,
      ngoDarpanID,
      location,
      description,
      pincode: String(pincode), // ← always store as String
      leader,
      password: hashedPassword,
      verificationStatus: {
        status: "Pending",
        message:
          "Your registration is under review. Please wait for admin verification.",
      },
    });

    res.status(201).json({
      success: true,
      message:
        "NGO registration submitted successfully. Please wait for verification before logging in.",
      verificationStatus: "Pending",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateReceiverProfile(req, res) {
  try {
    const { name, location, description, pincode, leader } = req.body;

    const receiver = await RECEIVER.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          name,
          location,
          description,
          pincode: String(pincode), // ← always store as String
          leader,
        },
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: receiver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAvailableDonations(req, res) {
  try {
    const ngo = await RECEIVER.findById(req.user._id);
    const prefix = String(ngo.pincode || "").slice(0, 4);

    const availableDonations = await FOOD.find({
      status: "Pending",
      pincode: { $regex: `^${prefix}` },
      receiverId: null,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: availableDonations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function acceptDonation(req, res) {
  try {
    const { donationId } = req.params;

    const donation = await FOOD.findOneAndUpdate(
      {
        _id: donationId,
        status: "Pending",
        receiverId: null,
      },
      {
        $set: {
          receiverId: req.user._id,
          status: "Accepted",
        },
      },
      { new: true },
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found or already accepted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Donation accepted successfully",
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getNearbyDonations(req, res) {
  try {
    const ngo = await RECEIVER.findById(req.user._id);
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    const prefix = String(ngo.pincode || "").slice(0, 4);

    // const nearbyDonations = await FOOD.find({
    //     pincode: { $regex: `^${prefix}` },
    //     status: 'Pending'
    // }).populate('donorId', 'name');

    const nearbyDonations = await FOOD.find({
      $or: [
        { pincode: { $regex: `^${prefix}` } },
        { receiverId: req.user._id }, // also include this NGO's own donations
      ],
    })
      .populate("donorId", "name")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: nearbyDonations,
    });
  } catch (error) {
    console.error("Error fetching nearby donations:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getNearbyNGOs(req, res) {
  try {
    const ngo = await RECEIVER.findById(req.user._id);
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }

    const pincodePrefix = String(ngo.pincode || "").slice(0, 4);

    // First migrate any old Number pincodes to String in the collection
    // so $regex works reliably on all documents
    await RECEIVER.updateMany({ pincode: { $type: "int" } }, [
      { $set: { pincode: { $toString: "$pincode" } } },
    ]);
    await RECEIVER.updateMany({ pincode: { $type: "double" } }, [
      { $set: { pincode: { $toString: "$pincode" } } },
    ]);

    const nearbyNGOs = await RECEIVER.find({
      _id: { $ne: req.user._id },
      pincode: { $regex: `^${pincodePrefix}` },
      "verificationStatus.status": "Verified",
    }).select("-password");

    res.status(200).json({ success: true, data: nearbyNGOs });
  } catch (error) {
    console.error("Error fetching nearby NGOs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateFoodStatus(req, res) {
  try {
    const { foodId } = req.params;
    const { status } = req.body;

    const food = await FOOD.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food donation not found",
      });
    }

    // Set receiverId whenever this NGO interacts with the donation
    if (!food.receiverId) {
      food.receiverId = req.user._id;
    }

    food.status = status;
    food.statusHistory = food.statusHistory || [];
    food.statusHistory.push({
      status,
      updatedAt: new Date(),
      updatedBy: req.user._id,
      updaterType: "RECEIVER",
    });

    await food.save();

    res.status(200).json({
      success: true,
      message: "Food status updated successfully",
      data: food,
    });
  } catch (error) {
    console.error("Error updating food status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getDonationHistory(req, res) {
  try {
    const receiver = await RECEIVER.findById(req.user._id);
    if (!receiver) {
      return res
        .status(404)
        .json({ success: false, message: "Receiver not found" });
    }

    const pincodePrefix = String(receiver.pincode || "").slice(0, 4);

    const donations = await FOOD.find({
      $or: [
        { receiverId: req.user._id },
        { "statusHistory.updatedBy": req.user._id },
        {
          pincode: { $regex: `^${pincodePrefix}` },
          status: { $in: ["Accepted", "Completed", "Cancelled"] },
        },
      ],
    }).sort({ date: -1 });

    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function verifyDonationQR(req, res) {
  try {
    const { donationId, token } = req.body;

    if (!donationId || !token) {
      return res.status(400).json({
        success: false,
        message: "donationId and token are required",
      });
    }

    const donation = await FOOD.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    // Ensure the donation is in Accepted state
    if (donation.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message:
          donation.status === "Completed"
            ? "This donation has already been completed"
            : `Donation must be in Accepted state. Current status: ${donation.status}`,
      });
    }

    // Ensure the scanning NGO is the one that accepted this donation
    if (
      !donation.receiverId ||
      donation.receiverId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to confirm this donation",
      });
    }

    // Guard: token must still be present (nullified after first use)
    if (!donation.qrToken) {
      return res.status(400).json({
        success: false,
        message: "QR code has already been used or is invalid",
      });
    }

    // Constant-time comparison to prevent timing attacks
    const crypto = require("crypto");
    const storedBuf  = Buffer.from(donation.qrToken, "hex");
    const receivedBuf = Buffer.from(token, "hex");

    const isValid =
      storedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(storedBuf, receivedBuf);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid QR token — verification failed",
      });
    }

    // Mark Completed, nullify token (one-time use), push to history
    donation.status = "Completed";
    donation.qrToken = null;
    donation.statusHistory = donation.statusHistory || [];
    donation.statusHistory.push({
      status: "Completed",
      updatedAt: new Date(),
      updatedBy: req.user._id,
      updaterType: "RECEIVER",
    });

    await donation.save();

    res.status(200).json({
      success: true,
      message: "Donation verified and marked as Completed!",
      data: donation,
    });
  } catch (error) {
    console.error("Error verifying donation QR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getReceiverProfile,
  receiverLogin,
  receiverRegister,
  updateReceiverProfile,
  getAvailableDonations,
  acceptDonation,
  getNearbyDonations,
  getNearbyNGOs,
  updateFoodStatus,
  getDonationHistory,
  verifyDonationQR,
};
