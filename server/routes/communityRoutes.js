const express = require("express");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const Comment = require("../models/Comment");
const IssueVote = require("../models/IssueVote");

const router = express.Router();

function getVoterId(req) {
  const headerId = req.header("x-user-id");
  if (headerId && String(headerId).trim()) return String(headerId).trim();
  const ip =
    (req.headers["x-forwarded-for"] &&
      String(req.headers["x-forwarded-for"]).split(",")[0]) ||
    req.socket?.remoteAddress ||
    "unknown";
  return `ip:${ip}`;
}

router.get("/api/community/issues", async (req, res) => {
  try {
    const issues = await Complaint.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "issueId",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
        },
      },
      {
        $project: {
          comments: 0,
        },
      },
    ]);

    res.status(200).json(issues);
  } catch (err) {
    console.error("Community issues error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/community/issues/:id/upvote", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid issue id" });

    const voterId = getVoterId(req);
    const issueObjectId = mongoose.Types.ObjectId.createFromHexString(id);

    const existing = await IssueVote.findOne({
      issueId: issueObjectId,
      voterId,
    });

    if (!existing) {
      await IssueVote.create({ issueId: issueObjectId, voterId, vote: "up" });
      const updated = await Complaint.findByIdAndUpdate(
        issueObjectId,
        { $inc: { upvotes: 1 } },
        { new: true },
      );
      return res.json({ issue: updated, userVote: "up", changed: true });
    }

    if (existing.vote === "up") {
      const current = await Complaint.findById(issueObjectId);
      return res.json({ issue: current, userVote: "up", changed: false });
    }

    existing.vote = "up";
    await existing.save();

    const updated = await Complaint.findByIdAndUpdate(
      issueObjectId,
      { $inc: { upvotes: 1, downvotes: -1 } },
      { new: true },
    );

    res.json({ issue: updated, userVote: "up", changed: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/community/issues/:id/downvote", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid issue id" });

    const voterId = getVoterId(req);
    const issueObjectId = mongoose.Types.ObjectId.createFromHexString(id);

    const existing = await IssueVote.findOne({
      issueId: issueObjectId,
      voterId,
    });

    if (!existing) {
      await IssueVote.create({ issueId: issueObjectId, voterId, vote: "down" });
      const updated = await Complaint.findByIdAndUpdate(
        issueObjectId,
        { $inc: { downvotes: 1 } },
        { new: true },
      );
      return res.json({ issue: updated, userVote: "down", changed: true });
    }

    if (existing.vote === "down") {
      const current = await Complaint.findById(issueObjectId);
      return res.json({ issue: current, userVote: "down", changed: false });
    }

    existing.vote = "down";
    await existing.save();

    const updated = await Complaint.findByIdAndUpdate(
      issueObjectId,
      { $inc: { upvotes: -1, downvotes: 1 } },
      { new: true },
    );

    res.json({ issue: updated, userVote: "down", changed: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/api/community/issues/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid issue id" });

    const comments = await Comment.find({
      issueId: mongoose.Types.ObjectId.createFromHexString(id),
    }).sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/community/issues/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { author, content } = req.body;

    if (!author || !content)
      return res.status(400).json({ message: "Invalid data" });

    await Comment.create({
      issueId: mongoose.Types.ObjectId.createFromHexString(id),
      author,
      content,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
