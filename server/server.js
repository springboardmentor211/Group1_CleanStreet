import express from "express";
import cors from "cors";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());

const readDB = async () => {
  return await fs.readJson(DB_PATH);
};

const writeDB = async (data) => {
  await fs.writeJson(DB_PATH, data, { spaces: 2 });
};

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const db = await readDB();

  const exists = db.users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  db.users.push({ name, email, password });
  await writeDB(db);

  res.json({ message: "Signup successful" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = await readDB();

  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
