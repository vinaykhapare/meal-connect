const jwt = require('jsonwebtoken');

async function generateJWT(res, user) {
    try {
        // Generate JWT with 24 hour expiry
        const token = jwt.sign(
            { _id: user._id, email: user.email },
            'yourSecretKey',
            { expiresIn: '24h' }
        );

        // Set cookie with 24 hour expiry
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Return both token and user data
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        res.status(500).send('Server error');
    }
}

module.exports = { generateJWT };