const express = require("express");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const User = require("../models/User");

const router = express.Router();

const ALLOWED_STATUS_UPDATES = ["pending", "in_progress", "resolved"];

/* =====================
   ADMIN: GET ALL COMPLAINTS
===================== */
router.get("/api/admin/complaints", async (_req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ complaints });
  } catch (err) {
    console.error("Admin complaints fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   ADMIN: UPDATE COMPLAINT STATUS
===================== */
router.patch("/api/admin/complaints/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    if (!ALLOWED_STATUS_UPDATES.includes(status)) {
      return res.status(400).json({
        message: "Status must be one of: pending, in_progress, resolved",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    )
      .populate("userId", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (err) {
    console.error("Admin complaint status update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   ADMIN: GET USERS WITH COMPLAINT COUNTS
===================== */
router.get("/api/admin/users", async (_req, res) => {
  try {
    const [users, complaintCounts] = await Promise.all([
      User.find({ role: { $ne: "admin" } })
        .select("name email role phone avatar createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      Complaint.aggregate([
        {
          $group: {
            _id: "$userId",
            complaintCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    const complaintCountMap = new Map(
      complaintCounts.map((entry) => [String(entry._id), entry.complaintCount]),
    );

    const usersWithCounts = users.map((u) => ({
      ...u,
      complaintCount: complaintCountMap.get(String(u._id)) || 0,
    }));

    res.status(200).json({
      totalUsers: usersWithCounts.length,
      users: usersWithCounts,
    });
  } catch (err) {
    console.error("Admin users fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
