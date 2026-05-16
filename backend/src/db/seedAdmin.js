const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")


const userModel = require("../models/user.model");
require("dotenv").config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGOOSE_KEY);
    console.log("db connected");

    const existing = await userModel.findOne({ email: "admin@campusvoice.com" });
    if (existing) {
      console.log("Admin already exists!");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await userModel.create({
      username: "admin",
      email: "admin@campusvoice.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully!");
    process.exit();
  } catch (err) {
    console.log("Error:", err.message);
    process.exit();
  }
}

seedAdmin();