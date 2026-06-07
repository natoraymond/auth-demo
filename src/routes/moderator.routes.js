// src/routes/moderator.routes.js
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

router.get("/reports", auth, role("moderator", "admin"), (req, res) => {
  res.json({ msg: "Reports data" });
});

module.exports = router;