const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

const otpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000;

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.BREVO_SMTP_PORT, 10) || 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
  logger: true,
  debug: true,
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send messages");
  }
});

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

router.post("/api/otp/send", async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const code = generateOtp();

  otpStore.set(normalizedEmail, {
    code,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  });

  try {
    const info = await transporter.sendMail({
      from: `"CleanStreet" <noorshab71@gmail.com>`,
      to: normalizedEmail,
      subject: "Your CleanStreet Verification Code",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f0fdf0; border-radius: 16px;">
          <h2 style="color: #14532d; margin: 0 0 8px;">CleanStreet</h2>
          <p style="color: #4b5563; margin: 0 0 24px;">Use the code below to verify your email address.</p>
          <div style="background: #ffffff; border: 2px solid #6cb45c; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #14532d;">${code}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("Email sent response:", info.response);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP email send error:", err);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
});

router.post("/api/otp/verify", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const stored = otpStore.get(normalizedEmail);

  if (!stored) {
    return res
      .status(400)
      .json({ message: "No OTP found. Please request a new one." });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalizedEmail);
    return res
      .status(400)
      .json({ message: "OTP has expired. Please request a new one." });
  }

  if (stored.code !== String(otp).trim()) {
    return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }

  otpStore.delete(normalizedEmail);

  res
    .status(200)
    .json({ verified: true, message: "OTP verified successfully" });
});

module.exports = router;
