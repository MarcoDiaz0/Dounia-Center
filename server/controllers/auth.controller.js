import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "dounia-center-secret-key-change-in-production";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const IS_PROD = process.env.NODE_ENV === "production";

/* ─────────────────────────────────────────────
   TOKEN HELPERS
───────────────────────────────────────────── */

const generateToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const sendTokenCookie = (res, token) => {
  res.cookie("dounia-token", token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax", // IMPORTANT FIX for SPA
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/* ─────────────────────────────────────────────
   REGISTER
───────────────────────────────────────────── */

export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
    });

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   LOGIN
───────────────────────────────────────────── */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    const isMatch = user.password == password;

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   GET ME
───────────────────────────────────────────── */

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   UPDATE PASSWORD
───────────────────────────────────────────── */

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   LOGOUT
───────────────────────────────────────────── */

export const logout = async (req, res) => {
  res.clearCookie("dounia-token", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
