const express = require("express");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

/* =====================
   CREATE COMPLAINT
===================== */
router.post("/complaints", async (req, res) => {
  const {
    userId,
    title,
    description,
    photo,
    location,
    category,
  } = req.body;

  try {
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Validate required fields
    if (!title || !description || !photo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({ message: "Location is required" });
    }

    let photoUrl = photo;
    if (photo && photo.startsWith("data:image")) {
      const uploadResult = await cloudinary.uploader.upload(photo, {
        folder: "cleanstreet/complaints",
        resource_type: "image",
      });
      photoUrl = uploadResult.secure_url;
    }

    const complaint = new Complaint({
      userId: new mongoose.Types.ObjectId(userId),
      title,
      description,
      photo: photoUrl,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || "",
      },
      category: category || "other",
      status: "pending",
    });

    await complaint.save();
    await complaint.populate("userId", "name email");

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (err) {
    console.error("Complaint creation error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   GET USER'S COMPLAINTS (by userId param)
===================== */
router.get("/complaints/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const complaints = await Complaint.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance

    res.status(200).json(complaints);
  } catch (err) {
    console.error("Error fetching user complaints:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   GET MY COMPLAINTS (from query param userId)
   Endpoint: GET /api/complaints/my?userId=xxx
===================== */
router.get("/api/complaints/my", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const complaints = await Complaint.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(complaints);
  } catch (err) {
    console.error("Error fetching my complaints:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   GET ALL COMPLAINTS (for admin/volunteer)
===================== */
router.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(complaints);
  } catch (err) {
    console.error("Error fetching all complaints:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   GET ALL COMPLAINTS FOR COMMUNITY VIEW
   Endpoint: GET /api/complaints/all
===================== */
router.get("/api/complaints/all", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .select("title description photo location category status createdAt upvotes downvotes")
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(complaints);
  } catch (err) {
    console.error("Error fetching all complaints:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   GET SINGLE COMPLAINT
===================== */
router.get("/complaints/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("userId", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   UPDATE COMPLAINT STATUS
===================== */
router.put("/complaints/:id", async (req, res) => {
  const { status, assignedTo } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (status) complaint.status = status;
    if (assignedTo) complaint.assignedTo = assignedTo;

    await complaint.save();
    await complaint.populate("userId", "name email");
    await complaint.populate("assignedTo", "name email");

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   DELETE COMPLAINT
===================== */
router.delete("/complaints/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.error("Error deleting complaint:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   GET COMPLAINT STATISTICS
   Endpoint: GET /api/complaints/stats?userId=xxx
===================== */
router.get("/api/complaints/stats", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);

    // Use aggregation for efficient counting
    const stats = await Complaint.aggregate([
      {
        $facet: {
          myComplaints: [
            { $match: { userId: userIdObj } },
            { $count: "total" }
          ],
          resolved: [
            { $match: { userId: userIdObj, status: "resolved" } },
            { $count: "total" }
          ],
          inProgress: [
            { $match: { userId: userIdObj, status: "in_progress" } },
            { $count: "total" }
          ],
          pending: [
            { $match: { userId: userIdObj, status: "pending" } },
            { $count: "total" }
          ]
        }
      }
    ]);

    // Extract counts from aggregation result
    const result = {
      myComplaints: stats[0].myComplaints[0]?.total || 0,
      resolved: stats[0].resolved[0]?.total || 0,
      inProgress: stats[0].inProgress[0]?.total || 0,
      pending: stats[0].pending[0]?.total || 0,
    };

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
