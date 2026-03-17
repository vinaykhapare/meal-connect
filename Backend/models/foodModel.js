const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DONOR",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minLength: [10, "Phone number must be 10 digits"],
    maxLength: [10, "Phone number must be 10 digits"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  totalCount: {
    type: Number,
    required: [true, "Total count is required"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Completed", "Cancelled"],
    default: "Pending",
  },
  address: String,
  foodType: String,
  description: String,
  pincode: {
    type: String,
    required: [true, "Pincode is required"],
  },
  expiryTime: {
    type: String,
    required: [true, "Expiry time is required"],
  },
  // ── Added: links donation to the NGO that accepted/acted on it ──
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RECEIVER",
    default: null,
  },
  // ── Added: tracks every status change with who made it ──
  statusHistory: [
    {
      status: {
        type: String,
        enum: ["Pending", "Accepted", "Completed", "Cancelled"],
      },
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId },
      updaterType: { type: String, enum: ["DONOR", "RECEIVER", "ADMIN"] },
    },
  ],
  // ── QR verification fields ──
  qrToken: {
    type: String,
    default: null,
  },
  qrCodeDataUrl: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Food", foodSchema);