// src/middlewares/logger.middleware.js
const Log = require("../models/log.model");

exports.logAction = async (action, user, ip) => {
  await Log.create({
    action,
    user,
    ipAddress: ip
  });
};