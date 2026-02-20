const mongoose = require("mongoose");
const { getAdminConnection } = require("../config/adminDb");

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true },
);

function getAdminUserModel() {
  const connection = getAdminConnection();
  return (
    connection.models.AdminUser ||
    connection.model("AdminUser", adminUserSchema, "admins")
  );
}

module.exports = {
  getAdminUserModel,
};
