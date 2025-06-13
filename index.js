// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Get __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve tools.json with CORS
app.get("/tools.json", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.resolve(__dirname, "tools.json"));
});

// ✅ Debuggable Date Tool Endpoint
app.post("/get_date", (req, res) => {
  console.log("🔍 Received request at /get_date");
  console.log("🧾 Headers:", req.headers);
  console.log("📦 Body:", req.body);

  const now = new Date();
  res.json({
    message: `The current server date and time is ${now.toISOString()}`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP HTTP server listening on port ${PORT}`);
});
