// src/controllers/auth.controller.js
const User = require("../models/user.model");
const Log = require("../models/log.model");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/token");

exports.register = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ msg: "Email already exists" });

  const hashed = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    password: hashed,
    role
  });

  res.status(201).json(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email});
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  // Check lock
  if (user.lockUntil && user.lockUntil > Date.now()) {
    return res.status(403).json({ msg: "Account locked. Try later." });
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 mins
    }

    await user.save();

    await Log.create({
      action: "FAILED_LOGIN",
      user: user._id,
      ipAddress: req.ip
    });

    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // reset on success
  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    }
  });
};