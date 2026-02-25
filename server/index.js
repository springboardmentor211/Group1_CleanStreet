const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { initAdminDb } = require("./config/adminDb");
require("dotenv").config();

console.log("Starting server...");
console.log("MONGO_URI =", process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" })); // Allow large base64 images
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("CleanStreet backend running successfully");
});

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/complaintRoutes"));
app.use("/", require("./routes/communityRoutes"));
app.use("/", require("./routes/adminDashboardRoutes"));
app.use("/", require("./routes/adminProfileRoutes"));
app.use("/", require("./routes/otpRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");
    initAdminDb();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
