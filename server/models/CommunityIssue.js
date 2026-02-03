const mongoose = require("mongoose");

const communityIssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

communityIssueSchema.index({ createdAt: -1 });
communityIssueSchema.index({ "location.latitude": 1, "location.longitude": 1 });

module.exports = mongoose.model("CommunityIssue", communityIssueSchema);

