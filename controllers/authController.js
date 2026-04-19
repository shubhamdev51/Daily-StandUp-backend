const User = require("../models/user");
const Standup = require("../models/standup");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const otpStore = new Map();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.sendOtp = async (req, res) => {
  console.log("POST /api/send-otp called");
  console.log("Request body:", req.body);
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);
    otpStore.set(email, { 
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });
    await sendEmail(email, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in /api/sendotp:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, otp } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already registered, Kindly login" });
//     }
//     const storedOtp = otpStore.get(email);
//     if (!storedOtp || storedOtp.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }
//     if (storedOtp.expiresAt < Date.now()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }
//     const newUser = new User({ name, email });
//     await newUser.save();
//     otpStore.delete(email);
//     const token = generateToken(newUser);
//     res.status(201).json({ message: "Signup successful", token,
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Signup failed" });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not registered, Kindly sign-up" });
    }
    const storedOtp = otpStore.get(email);
    if (!storedOtp || storedOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    otpStore.delete(email);
    const token = generateToken(user);
    const todayDate = new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Kolkata'});
    const todayStandup = await Standup.findOne({
      user: user._id,
      date: todayDate
    });
    const recentStandups = await Standup.find({ user: user._id })
      .sort({ date: -1 })
      .limit(20);
    //normalize project names (avoid duplicates like "Project A" vs "project a")
    const normalize = (p) => p?.trim().toLowerCase();
    const morningProjects = [
      ...new Map(
        recentStandups
          .flatMap(s => {
            if (Array.isArray(s.morning?.project)) return s.morning.project;
            return s.morning?.project ? [s.morning.project] : [];
          })
          .filter(Boolean)
          .map(p => [normalize(p), p]) // unique by normalized key
      ).values()
    ].slice(0, 5);
    const eveningProjects = [
      ...new Map(
        recentStandups
          .flatMap(s => {
            if (Array.isArray(s.evening?.project)) return s.evening.project;
            return s.evening?.project ? [s.evening.project] : [];
          })
          .filter(Boolean)
          .map(p => [normalize(p), p])
      ).values()
    ].slice(0, 5);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      standup: {
        morningSubmitted: !!todayStandup?.morning?.submittedAt,
        eveningSubmitted: !!todayStandup?.evening?.submittedAt,

        projects: {
          morning: morningProjects,
          evening: eveningProjects
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};