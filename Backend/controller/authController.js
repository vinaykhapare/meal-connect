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
  const appName = "Meal Connect" || process.env.APP_NAME;

  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${appName}" <${from}>`,
    to,
    subject: `${appName} • Password Reset OTP`,

    text: `Hello,

We received a request to reset your password for ${appName}.

Your One-Time Password (OTP) is: ${otp}

This OTP is valid for 5 minutes.

If you did not request this, please ignore this email.

Regards,  
${appName} Team`,

    // HTML version
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        
        <h2 style="text-align: center; color: #27ae60;">
          🍽️ ${appName}
        </h2>

        <h3 style="color: #333;">Password Reset Request</h3>

        <p>Hello,</p>

        <p>We received a request to reset your password. Use the OTP below to continue:</p>

        <div style="
          text-align: center;
          margin: 25px 0;
        ">
          <span style="
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 6px;
            background: #f1f1f1;
            padding: 12px 20px;
            border-radius: 6px;
            display: inline-block;
          ">
            ${otp}
          </span>
        </div>

        <p style="text-align: center;">
          ⏳ This OTP will expire in <strong>5 minutes</strong>
        </p>

        <p>If you didn’t request this, you can safely ignore this email.</p>

        <hr style="margin: 25px 0;" />

        <p style="font-size: 12px; color: #888; text-align: center;">
          This is an automated message from ${appName}. Please do not reply.
        </p>

      </div>
    `,
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