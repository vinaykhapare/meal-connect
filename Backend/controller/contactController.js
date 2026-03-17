const Contact = require('../models/contactModel');

const contactController = {
    // Submit contact form
    submitContact: async (req, res) => {
        try {
            const { name, email, subject, message } = req.body;

            // Validate required fields
            if (!name || !email || !subject || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            // Create new contact entry
            const contact = await Contact.create({
                name,
                email,
                subject,
                message
            });

            res.status(201).json({
                success: true,
                message: 'Thank you for contacting us! We will get back to you soon.',
                data: contact
            });

        } catch (error) {
            console.error('Contact submission error:', error);
            res.status(500).json({
                success: false,
                message: 'Error submitting contact form',
                error: error.message
            });
        }
    },

    // Get all contact submissions (for admin)
    getAllContacts: async (req, res) => {
        try {
            const contacts = await Contact.find()
                .sort({ createdAt: -1 }); // Most recent first

            res.status(200).json({
                success: true,
                count: contacts.length,
                data: contacts
            });

        } catch (error) {
            console.error('Error fetching contacts:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching contact submissions',
                error: error.message
            });
        }
    },

    // Update contact status (for admin)
    updateContactStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const contact = await Contact.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: 'Contact submission not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Contact status updated successfully',
                data: contact
            });

        } catch (error) {
            console.error('Error updating contact status:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating contact status',
                error: error.message
            });
        }
    }
};

module.exports = contactController; 