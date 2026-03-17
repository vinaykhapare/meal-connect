const Admin = require('../models/adminModel');
const RECEIVER = require('../models/receiverModel');
const DONOR = require('../middleware/donorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminController = {
    // Admin login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            const token = jwt.sign(
                { _id: admin._id, role: 'admin' },
                'yourSecretKey',
                { expiresIn: '24h' }
            );

            res.status(200).json({
                success: true,
                token,
                admin: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get pending NGO verifications
    getPendingVerifications: async (req, res) => {
        try {
            const pendingNGOs = await RECEIVER.find({
                'verificationStatus.status': 'Pending'
            }).select('-password');

            res.status(200).json({
                success: true,
                data: pendingNGOs
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Verify or reject NGO
    updateNGOVerification: async (req, res) => {
        try {
            const { ngoId } = req.params;
            const { status, message } = req.body;

            if (!['Verified', 'Rejected'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status"
                });
            }

            const ngo = await RECEIVER.findByIdAndUpdate(
                ngoId,
                {
                    'verificationStatus.status': status,
                    'verificationStatus.message': message,
                    'verificationStatus.verifiedAt': status === 'Verified' ? new Date() : null
                },
                { new: true }
            );

            if (!ngo) {
                return res.status(404).json({
                    success: false,
                    message: "NGO not found"
                });
            }

            res.status(200).json({
                success: true,
                message: `NGO ${status.toLowerCase()} successfully`,
                data: ngo
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all NGOs (verified) with optional pincode filter
    getAllNGOs: async (req, res) => {
        try {
            const { pincode, search } = req.query;
            const query = {};
            if (pincode) query.pincode = Number(pincode);
            if (search) query.name = { $regex: search, $options: 'i' };

            const ngos = await RECEIVER.find(query).select('-password');
            res.status(200).json({ success: true, data: ngos });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update an NGO by ID
    updateNGO: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            delete updateData.password; // never update password here

            const ngo = await RECEIVER.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('-password');
            if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found' });

            res.status(200).json({ success: true, message: 'NGO updated successfully', data: ngo });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Delete an NGO by ID
    deleteNGO: async (req, res) => {
        try {
            const { id } = req.params;
            const ngo = await RECEIVER.findByIdAndDelete(id);
            if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found' });

            res.status(200).json({ success: true, message: 'NGO deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get all users/donors with optional pincode filter
    getAllUsers: async (req, res) => {
        try {
            const { pincode } = req.query;
            const query = {};
            if (pincode) query.pincode = Number(pincode);

            const users = await DONOR.find(query).select('-password');
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update a user/donor by ID
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            delete updateData.password;

            const user = await DONOR.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('-password');
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            res.status(200).json({ success: true, message: 'User updated successfully', data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Delete a user/donor by ID
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await DONOR.findByIdAndDelete(id);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            res.status(200).json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = adminController; 