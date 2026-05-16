const express = require("express");
const authRoutes = require("./routes/user.routes");
const complaintRoutes = require("./routes/complaint.routes");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const app = express();
app.use(
    cors({ origin: "http://localhost:5173", credentials: true })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/complaint", complaintRoutes);

module.exports = app;
