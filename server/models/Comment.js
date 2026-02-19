const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

commentSchema.index({ issueId: 1, createdAt: 1 });

module.exports = mongoose.model("Comment", commentSchema);
