const express = require("express");
const authRoutes = require("./routes/user.routes");
const complaintRoutes = require("./routes/complaint.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin === "http://localhost:5173" ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/complaint", complaintRoutes);

module.exports = app;
