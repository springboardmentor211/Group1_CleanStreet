const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true }, // URL or base64
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: String,
    },
    category: {
      type: String,
      enum: [
        "garbage",
        "pothole",
        "water_leakage",
        "broken_streetlight",
        "other",
      ],
      default: "other",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "rejected"],
      default: "pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// Add indexes for optimized queries
complaintSchema.index({ userId: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ createdAt: -1 }); // For sorting by newest first

module.exports = mongoose.model("Complaint", complaintSchema);
