// src/routes/user.routes.js
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");

router.get("/profile", auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;