const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const adminProtectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Access denied. No token provided." 
            });
        }

        const decoded = jwt.verify(token, "yourSecretKey");
        const admin = await Admin.findById(decoded._id);

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ 
                success: false,
                message: "Access denied. Admin only." 
            });
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

module.exports = { adminProtectedRoute }; 