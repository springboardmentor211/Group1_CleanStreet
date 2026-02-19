#!/usr/bin/env node

/**
 * Admin User Creation Script
 * Run: node createAdmin.js [email] [password] [name]
 * Example: node createAdmin.js admin@cleanstreet.com admin123 "Admin User"
 */

const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createAdmin() {
  try {
    // Get arguments from command line
    const args = process.argv.slice(2);
    const email = args[0] || "admin@cleanstreet.com";
    const password = args[1] || "admin123";
    const name = args[2] || "Admin User";
    const phone = args[3] || "+1234567890";

    console.log("🔍 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(`❌ User with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create admin user
    const admin = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
      avatar: "",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log(`\n📋 Admin Credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: admin`);
    console.log(`\nYou can now login to the admin dashboard with these credentials.\n`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
