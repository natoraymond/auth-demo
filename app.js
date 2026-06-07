const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/public", require("./src/routes/public.routes"));
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/user", require("./src/routes/user.routes"));
app.use("/api/admin", require("./src/routes/admin.routes"));

module.exports = app;