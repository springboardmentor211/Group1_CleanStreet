const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const { getAdminUserModel } = require("../models/AdminUser");

const router = express.Router();

const toUserResponse = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role || "user",
  avatar: user.avatar || null,
});

const normalizeEmail = (email = "") => email.trim().toLowerCase();

/* =====================
   SIGNUP
===================== */
router.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: "user",
    });

    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   LOGIN
===================== */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Login success - return user data (without password)
    const userData = toUserResponse(user);

    res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   ADMIN SIGNUP
===================== */
router.post("/admin/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const AdminUser = getAdminUserModel();
    const normalizedEmail = normalizeEmail(email);
    const [existingAdmin, existingUser] = await Promise.all([
      AdminUser.findOne({ email: normalizedEmail }),
      User.findOne({ email: normalizedEmail }),
    ]);

    if (existingAdmin || existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new AdminUser({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    res.status(201).json({ message: "Admin signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   ADMIN LOGIN
===================== */
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const AdminUser = getAdminUserModel();
    const normalizedEmail = normalizeEmail(email);
    let user = await AdminUser.findOne({ email: normalizedEmail });

    if (!user) {
      // Backward compatibility for older admin accounts already saved
      // in the shared user collection before admin DB separation.
      user = await User.findOne({ email: normalizedEmail, role: "admin" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userData = toUserResponse(user);

    res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   UPDATE USER PROFILE
===================== */
router.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phone, avatar } = req.body;

  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    // Return updated user data (without password)
    const userData = toUserResponse(user);

    res.status(200).json({
      message: "Profile updated successfully",
      user: userData,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
