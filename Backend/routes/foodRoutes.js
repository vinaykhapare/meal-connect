const express = require("express");
const router = express.Router();

const {
    getFoodList, 
    getFoodListByid, 
    donateFood, 
    updateStatus, 
    createFood, 
    getUserDonations, 
    updateDonationStatus,
    createFoodDonation
} = require("../controller/foodFun.js");

const { authMiddleware } = require("../middleware/auth.js");
const { validateDonation } = require("../middleware/validateDonation.js");

// Protected routes - require authentication
router.post("/donate", authMiddleware, validateDonation, createFoodDonation);
router.get("/user-donations", authMiddleware, getUserDonations);
router.patch("/update-status/:id", authMiddleware, updateDonationStatus);

// Public routes
router.get("/foodList", getFoodList);
router.get("/foodList/:foodId", getFoodListByid);

module.exports = router;