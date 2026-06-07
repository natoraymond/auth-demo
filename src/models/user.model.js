// src/models/user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["user", "moderator", "admin"],
    default: "user"
  },

  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);