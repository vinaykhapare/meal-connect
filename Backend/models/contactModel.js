const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^.+@.+$/, 'Please enter a valid email']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        maxLength: [1000, 'Message cannot exceed 1000 characters']
    },
    status: {
        type: String,
        enum: ['Pending', 'Responded', 'Closed'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema); 