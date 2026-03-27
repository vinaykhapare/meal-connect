const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth");
const { adminProtectedRoute } = require("../middleware/adminProtectedRoute");
const {
  getUserInsights,
  getNgoInsights,
  getAdminInsights,
} = require("../controller/insightsController");

// User insights (donor)
router.get("/user", authMiddleware, getUserInsights);

// NGO insights (receiver)
router.get("/ngo", authMiddleware, getNgoInsights);

// Admin insights
router.get("/admin", adminProtectedRoute, getAdminInsights);

module.exports = router;

