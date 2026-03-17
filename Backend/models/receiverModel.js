const mongoose = require("mongoose");

const receiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /^.+@.+$/ },
  ngoDarpanID: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  is_donor: { type: Boolean, default: false },
  pincode: { type: String, required: true },
  leader: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, match: /^.+@.+$/ }
  },
  password: { type: String, required: true },
  verificationStatus: {
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending'
    },
    message: { type: String },
    verifiedAt: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model("RECEIVER", receiverSchema);