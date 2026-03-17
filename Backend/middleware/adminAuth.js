const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const adminAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        const verified = jwt.verify(token, "yourSecretKey");
        const admin = await Admin.findById(verified._id);

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Access Denied. Admin only." });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token or not authorized'
        });
    }
};

module.exports = { adminAuthMiddleware }; 