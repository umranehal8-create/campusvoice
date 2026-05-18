const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body; // role hatao

    const doesUserAlreadyExist = await userModel.findOne({ email });
    if (doesUserAlreadyExist) {
      return res.status(409).json({
        message: "user already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashed,
      role: "user",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "user created successfully",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) {
      return res.status(401).json({
        message: "invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "user logged in successfully",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
}

module.exports = { registerUser, loginUser };
