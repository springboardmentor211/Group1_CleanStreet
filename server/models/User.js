const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: { type: String, enum: ["user", "admin", "volunteer"], default: "user" },
    avatar: String, // base64 or URL
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
