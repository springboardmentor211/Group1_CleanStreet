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
      { $project: { comments: 0 } },
    ]);
    res.status(200).json(issues);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

async function applyVote({ issueId, voterId, vote }) {
  const issueObjectId = new mongoose.Types.ObjectId(issueId);
  const existing = await IssueVote.findOne({
    issueId: issueObjectId,
    voterId,
  }).lean();

  if (!existing) {
    await IssueVote.create({ issueId: issueObjectId, voterId, vote });
    const inc = vote === "up" ? { upvotes: 1 } : { downvotes: 1 };
    const updated = await Complaint.findByIdAndUpdate(
      issueObjectId,
      { $inc: inc },
      { new: true },
    ).lean();
    return { updated, userVote: vote, changed: true };
  }

  if (existing.vote === vote) {
    return {
      updated: await Complaint.findById(issueObjectId).lean(),
      userVote: vote,
      changed: false,
    };
  }

  await IssueVote.updateOne({ _id: existing._id }, { $set: { vote } });
  const inc =
    vote === "up"
      ? { upvotes: 1, downvotes: -1 }
      : { upvotes: -1, downvotes: 1 };
  const updated = await Complaint.findByIdAndUpdate(
    issueObjectId,
    { $inc: inc },
    { new: true },
  ).lean();
  return { updated, userVote: vote, changed: true };
}

router.post("/api/community/issues/:id/upvote", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid issue id" });
    const voterId = getVoterId(req);
    const result = await applyVote({ issueId: id, voterId, vote: "up" });
    res.status(result.changed ? 200 : 409).json({
      issue: result.updated,
      userVote: result.userVote,
      changed: result.changed,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/community/issues/:id/downvote", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid issue id" });
    const voterId = getVoterId(req);
    const result = await applyVote({ issueId: id, voterId, vote: "down" });
    res.status(result.changed ? 200 : 409).json({
      issue: result.updated,
      userVote: result.userVote,
      changed: result.changed,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/api/community/issues/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid issue id" });
    const comments = await Comment.find({
      issueId: new mongoose.Types.ObjectId(id),
    })
      .sort({ createdAt: 1 })
      .lean();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/community/issues/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { author, content } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid issue id" });
    if (!author || !content)
      return res.status(400).json({ message: "Invalid data" });
    const exists = await Complaint.exists({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!exists) return res.status(404).json({ message: "Issue not found" });
    const comment = await Comment.create({
      issueId: new mongoose.Types.ObjectId(id),
      author,
      content,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
