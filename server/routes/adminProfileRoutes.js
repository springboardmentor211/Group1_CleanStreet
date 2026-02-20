const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const { getAdminUserModel } = require("../models/AdminUser");

const router = express.Router();

const toAdminResponse = (admin) => ({
  id: admin._id.toString(),
  name: admin.name,
  email: admin.email,
  phone: admin.phone,
  role: admin.role || "admin",
  avatar: admin.avatar || "",
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

async function findAdminDocument(adminId) {
  const AdminUser = getAdminUserModel();

  const adminFromAdminDb = await AdminUser.findById(adminId);
  if (adminFromAdminDb) {
    return adminFromAdminDb;
  }

  return User.findOne({ _id: adminId, role: "admin" });
}

/* =====================
   ADMIN PROFILE: GET
===================== */
router.get("/api/admin/profile/:adminId", async (req, res) => {
  const { adminId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: "Invalid admin ID" });
    }

    const admin = await findAdminDocument(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ admin: toAdminResponse(admin) });
  } catch (err) {
    console.error("Admin profile fetch error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   ADMIN PROFILE: UPDATE BASIC FIELDS
===================== */
router.patch("/api/admin/profile/:adminId", async (req, res) => {
  const { adminId } = req.params;
  const { name, phone } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: "Invalid admin ID" });
    }

    if (name === undefined && phone === undefined) {
      return res.status(400).json({ message: "No profile fields provided" });
    }

    const admin = await findAdminDocument(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (name !== undefined) {
      admin.name = String(name).trim();
    }

    if (phone !== undefined) {
      admin.phone = String(phone).trim();
    }

    await admin.save();

    return res.status(200).json({
      message: "Admin profile updated successfully",
      admin: toAdminResponse(admin),
    });
  } catch (err) {
    console.error("Admin profile update error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   ADMIN PROFILE: UPDATE PHOTO
===================== */
router.patch("/api/admin/profile/:adminId/photo", async (req, res) => {
  const { adminId } = req.params;
  const { photo } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: "Invalid admin ID" });
    }

    if (!photo || typeof photo !== "string") {
      return res.status(400).json({ message: "Photo is required" });
    }

    const admin = await findAdminDocument(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let avatarUrl = photo.trim();

    if (avatarUrl.startsWith("data:image")) {
      const uploadResult = await cloudinary.uploader.upload(avatarUrl, {
        folder: "cleanstreet/admin_profiles",
        resource_type: "image",
      });
      avatarUrl = uploadResult.secure_url;
    }

    admin.avatar = avatarUrl;
    await admin.save();

    return res.status(200).json({
      message: "Admin profile photo updated successfully",
      admin: toAdminResponse(admin),
    });
  } catch (err) {
    console.error("Admin profile photo update error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
