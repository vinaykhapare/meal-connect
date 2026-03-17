const validateDonation = (req, res, next) => {
    const { name, phone, totalCount, pincode, expiryTime } = req.body;

    if (!name || !phone || !totalCount || !pincode || !expiryTime) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        });
    }

    if (phone.length !== 10 || isNaN(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid 10-digit phone number'
        });
    }

    if (totalCount <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Total count must be greater than 0'
        });
    }

    // Validate pincode format (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid pincode format'
        });
    }

    next();
};

module.exports = { validateDonation }; 