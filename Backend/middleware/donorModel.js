const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    match: /^.+@.+$/, 
    lowercase: true,
    trim: true
  },
  phone: { type: String, required: true },
  location: { type: String, default: '' },
  is_donor: { type: Boolean, default: true },
  pincode: { type: Number, default: null },
  foodSource: {
    sourceType: { type: String, default: '' },
    sourceName: { type: String, default: '' },
    sourceLocation: { type: String, default: '' },
    pincode: { type: Number, default: null }
  },
  password: { type: String, required: true }
}, { timestamps: true });

// Add a pre-save middleware to ensure email is lowercase
donorSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Add a pre-findOne middleware to ensure email query is lowercase
donorSchema.pre('findOne', function(next) {
  if (this._conditions.email) {
    this._conditions.email = this._conditions.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model("DONOR", donorSchema);