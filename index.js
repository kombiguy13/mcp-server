import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { wp_post } from "./tools/wordpress.js";
import { z } from "zod";

dotenv.config();

const app = express();
app.use(cors()); // ✅ Allow all domains (Claude needs this)
app.use(express.json());

// ✅ Serve tools.json with explicit CORS header
app.get("/tools.json", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // << This is the key line
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.resolve("tools.json"));
});

// Your existing WordPress posting endpoint
app.post("/wp_post", async (req, res) => {
  try {
    const schema = z.object({
      title: z.string(),
      content: z.string(),
      image_url: z.string(),
      filename: z.string()
    });

    const input = schema.parse(req.body);
    const result = await wp_post(input);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP HTTP server listening on port ${PORT}`);
});
