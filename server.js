require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use(cors({
  origin: "https://daily-standup-sepia.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

app.listen(PORT, () => {
  console.log("Server running on port 5000");
});