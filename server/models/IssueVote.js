const mongoose = require("mongoose");

const issueVoteSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      index: true,
    },
    voterId: {
      type: String,
      required: true,
      index: true,
    },
    vote: {
      type: String,
      enum: ["up", "down"],
      required: true,
    },
  },
  { timestamps: true },
);

issueVoteSchema.index({ issueId: 1, voterId: 1 }, { unique: true });

module.exports = mongoose.model("IssueVote", issueVoteSchema);
