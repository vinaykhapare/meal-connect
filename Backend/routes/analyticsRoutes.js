const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controller/analyticsController');
const { authMiddleware } = require('../middleware/auth');

// Protected route - requires authentication
router.get('/distribution', authMiddleware, getAnalytics);

module.exports = router; 