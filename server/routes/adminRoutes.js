const express = require("express");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { PDFDocument, rgb } = require("@react-pdf/renderer");

const router = express.Router();

/* =====================
   ADMIN STATS
===================== */
router.get("/api/admin/stats", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: "pending" });
    const activeUsers = await User.countDocuments();
    const resolvedToday = await Complaint.countDocuments({
      status: "resolved",
      updatedAt: { $gte: today },
    });

    res.json({
      totalComplaints,
      pendingComplaints,
      activeUsers,
      resolvedToday,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
});

/* =====================
   GET ALL COMPLAINTS (ADMIN VIEW)
===================== */
router.get("/api/admin/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

/* =====================
   UPDATE COMPLAINT STATUS (ADMIN)
===================== */
router.put("/api/admin/complaints/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    const validStatuses = ["pending", "in_progress", "resolved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("userId", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    console.error("Error updating complaint:", err);
    res.status(500).json({ message: "Failed to update complaint" });
  }
});

/* =====================
   GET ALL USERS (ADMIN VIEW)
===================== */
router.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });

    // Get complaint count for each user
    const usersWithComplaintCount = await Promise.all(
      users.map(async (user) => {
        const complaintCount = await Complaint.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          complaintCount,
        };
      })
    );

    res.json(usersWithComplaintCount);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/* =====================
   GENERATE REPORT
===================== */
router.get("/api/admin/report/generate", async (req, res) => {
  try {
    // Fetch data for report
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: "resolved" });
    const inProgressComplaints = await Complaint.countDocuments({ status: "in_progress" });
    const pendingComplaints = await Complaint.countDocuments({ status: "pending" });
    const rejectedComplaints = await Complaint.countDocuments({ status: "rejected" });
    const totalUsers = await User.countDocuments();

    // Get complaints by category
    const complaintsByCategory = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Create a simple text-based report since PDF library might not be available
    let reportContent = `CLEANSTREET ADMIN REPORT\n`;
    reportContent += `Generated: ${new Date().toLocaleString()}\n`;
    reportContent += `\n=== SYSTEM OVERVIEW ===\n`;
    reportContent += `Total Complaints: ${totalComplaints}\n`;
    reportContent += `Resolved: ${resolvedComplaints}\n`;
    reportContent += `In Progress: ${inProgressComplaints}\n`;
    reportContent += `Pending: ${pendingComplaints}\n`;
    reportContent += `Rejected: ${rejectedComplaints}\n`;
    reportContent += `Total Users: ${totalUsers}\n`;
    reportContent += `\n=== COMPLAINTS BY CATEGORY ===\n`;

    complaintsByCategory.forEach((cat) => {
      const categoryLabel = {
        garbage: "Garbage Dump",
        pothole: "Pothole",
        water_leakage: "Water Leakage",
        broken_streetlight: "Broken Streetlight",
        other: "Other",
      }[cat._id] || "Unknown";
      reportContent += `${categoryLabel}: ${cat.count}\n`;
    });

    reportContent += `\n=== REPORT END ===\n`;

    // Send as text file (PDF generation would require proper library setup)
    res.setHeader("Content-Type", "text/plain");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="admin-report-${new Date().toISOString().split("T")[0]}.txt"`
    );
    res.send(reportContent);
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ message: "Failed to generate report" });
  }
});

/* =====================
   GET COMPLAINT ANALYTICS
===================== */
router.get("/api/admin/analytics", async (req, res) => {
  try {
    // Get complaints grouped by status
    const byStatus = await Complaint.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get complaints grouped by category
    const byCategory = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get complaints over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const byDate = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      byStatus,
      byCategory,
      byDate,
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

module.exports = router;
