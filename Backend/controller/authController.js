const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const DONOR = require("../middleware/donorModel");
const RECEIVER = require("../models/receiverModel");
const Admin = require("../models/adminModel");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getTransporter() {
  const user = process.env.EMAIL;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error("Missing email env vars (EMAIL / EMAIL_PASS).");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

async function sendOtpEmail({ to, otp }) {
  const from = process.env.EMAIL;
  const appName = process.env.APP_NAME || "MealConnect";

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"${appName}" <${from}>`,
    to,
    subject: `${appName} - Password Reset OTP`,
    text: `Your OTP for password reset is: ${otp}\n\nThis OTP expires in 5 minutes.\n\nIf you did not request this, please ignore this email.`,
  });
}

async function findAccountByEmail(email) {
  const donor = await DONOR.findOne({ email });
  if (donor) return { model: "DONOR", doc: donor };
  const receiver = await RECEIVER.findOne({ email });
  if (receiver) return { model: "RECEIVER", doc: receiver };
  const admin = await Admin.findOne({ email });
  if (admin) return { model: "ADMIN", doc: admin };
  return null;
}

async function forgotPassword(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const account = await findAccountByEmail(email);
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found with this email" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    account.doc.otp = otp;
    account.doc.otpExpiry = otpExpiry;
    await account.doc.save();

    await sendOtpEmail({ to: email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email (valid for 5 minutes).",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function verifyOtp(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: "OTP must be 6 digits" });
    }

    const account = await findAccountByEmail(email);
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found with this email" });
    }

    if (!account.doc.otp || !account.doc.otpExpiry) {
      return res.status(400).json({ success: false, message: "No OTP request found. Please request a new OTP." });
    }
    if (new Date(account.doc.otpExpiry).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired. Please request a new OTP." });
    }
    if (account.doc.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    return res.status(200).json({ success: true, message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function resetPassword(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();
    const newPassword = String(req.body.newPassword || "");

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, OTP and newPassword are required" });
    }
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: "OTP must be 6 digits" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const account = await findAccountByEmail(email);
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found with this email" });
    }

    if (!account.doc.otp || !account.doc.otpExpiry) {
      return res.status(400).json({ success: false, message: "No OTP request found. Please request a new OTP." });
    }
    if (new Date(account.doc.otpExpiry).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired. Please request a new OTP." });
    }
    if (account.doc.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.doc.password = hashedPassword;
    account.doc.otp = null;
    account.doc.otpExpiry = null;
    await account.doc.save();

    return res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { forgotPassword, verifyOtp, resetPassword };