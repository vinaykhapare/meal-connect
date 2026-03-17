const express = require('express');
const router = express.Router();

const { donorLogin, donorResgister, getProfile, updateProfile } = require('../controller/donorFun');
const { authMiddleware } = require('../middleware/auth');

// Ensure these routes match the frontend requests
router.post('/signup', donorResgister);  // Changed from /register
router.post('/login', donorLogin);
router.get('/me', authMiddleware, getProfile);
router.put('/update', authMiddleware, updateProfile);

module.exports = router;