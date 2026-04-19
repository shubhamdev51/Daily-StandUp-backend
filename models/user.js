const mongoose = require('mongoose');

const users = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["staff","admin"],
        default: "staff"
    }
});

const User = mongoose.model("User",users);
module.exports = User;