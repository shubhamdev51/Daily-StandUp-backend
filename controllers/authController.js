const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

const otpStore = new Map();

/* ---------------- SEND OTP ---------------- */
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiry (5 minutes)
    otpStore.set(email, { 
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    await sendEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

/* ---------------- SIGNUP ---------------- */
exports.signup = async (req, res) => {
  try {
    const { name, email, otp } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const storedOtp = otpStore.get(email);

    if (!storedOtp || storedOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const newUser = new User({ name, email });
    await newUser.save();

    otpStore.delete(email);

    res.status(201).json({ message: "Signup successful" });

  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
};

/* ---------------- LOGIN ---------------- */
exports.login = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    const storedOtp = otpStore.get(email);

    if (!storedOtp || storedOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    otpStore.delete(email);

    res.status(200).json({
      message: "Login successful",
      user
    });

  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};