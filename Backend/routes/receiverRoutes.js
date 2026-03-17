const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.js");
const {
    receiverLogin,
    receiverRegister,
    getReceiverProfile,
    updateReceiverProfile,
    getAvailableDonations,
    acceptDonation,
    getNearbyDonations,
    getNearbyNGOs,
    updateFoodStatus,
    getDonationHistory,
    verifyDonationQR,        // ← QR verification
} = require('../controller/receiverFun.js');

// Public routes
router.post("/register", receiverRegister);
router.post("/login", receiverLogin);

// Protected routes
router.get("/me", authMiddleware, getReceiverProfile);
router.put("/update", authMiddleware, updateReceiverProfile);
router.get("/available-donations", authMiddleware, getAvailableDonations);
router.post("/accept-donation/:donationId", authMiddleware, acceptDonation);
router.get("/nearby-donations", authMiddleware, getNearbyDonations);
router.get("/nearby-ngos", authMiddleware, getNearbyNGOs);
router.put("/food-status/:foodId", authMiddleware, updateFoodStatus);
router.get("/donation-history", authMiddleware, getDonationHistory);
router.post("/verify-qr", authMiddleware, verifyDonationQR);   // ← QR verification

module.exports = router;