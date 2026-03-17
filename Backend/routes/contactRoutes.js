const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');

// Public route for submitting contact form
router.post('/submit', contactController.submitContact);

// Get all contacts (can be protected later if needed)
router.get('/all', contactController.getAllContacts);

module.exports = router; 