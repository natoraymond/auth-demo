// src/routes/admin.routes.js
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const User = require("../models/user.model");
const Log = require("../models/log.model");

// Delete user
router.delete("/user/:id", auth, role("admin"), async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ msg: "Admin cannot delete self" });
  }

  await User.findByIdAndDelete(req.params.id);

  await Log.create({
    action: "DELETE_USER",
    user: req.user.id,
    ipAddress: req.ip
  });

  res.json({ msg: "User deleted" });
});

// Promote
router.post("/promote/:id", auth, role("admin"), async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ msg: "User not found" });

  if (user.role === "admin") {
    return res.status(400).json({ msg: "Cannot promote admin" });
  }

  user.role = "moderator";
  await user.save();

  res.json({ msg: "User promoted" });
});

module.exports = router;