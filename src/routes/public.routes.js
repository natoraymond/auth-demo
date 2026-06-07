// src/routes/public.routes.js
const router = require("express").Router();

router.get("/message", (req, res) => {
  res.json({ message: "This route is public" });
});

module.exports = router;