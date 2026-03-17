const RECEIVER = require('../models/receiverModel');

const receiverAuthMiddleware = async (req, res, next) => {
    try {
        // Check if user exists and is a receiver
        const receiver = await RECEIVER.findById(req.user._id);
        
        if (!receiver) {
            return res.status(403).json({
                success: false,
                message: "Access denied. NGO only route."
            });
        }

        req.receiver = receiver;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};

module.exports = { receiverAuthMiddleware }; 