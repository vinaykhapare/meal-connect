const receiverSignup = async (req, res) => {
    try {
        // ... signup logic
    } catch (error) {
        // console.error('Receiver signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during signup'
        });
    }
};

// ... other functions with console.log() commented out 