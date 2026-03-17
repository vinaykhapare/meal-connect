const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { adminProtectedRoute } = require('../middleware/adminProtectedRoute');

// Public admin route
router.post('/login', adminController.login);

// Protected admin routes
router.use(adminProtectedRoute); // Apply middleware to all routes below
router.get('/pending-verifications', adminController.getPendingVerifications);
router.put('/verify-ngo/:ngoId', adminController.updateNGOVerification);

// NGO Management routes
router.get('/ngos', adminController.getAllNGOs);
router.put('/ngos/:id', adminController.updateNGO);
router.delete('/ngos/:id', adminController.deleteNGO);

// User Management routes
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router; 