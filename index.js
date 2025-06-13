import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { wp_post } from "./tools/wordpress.js";
import { z } from "zod";

dotenv.config();

const app = express();
app.use(cors()); // ✅ Allow all origins for Claude
app.use(express.json());

// 📍 Required for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Serve Claude-compatible tools.json
app.get("/tools.json", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.sendFile(resolve(__dirname, "tools.json"));
});

// ✅ Main webhook endpoint for wp_post
app.post("/wp_post", async (req, res) => {
  try {
    let input;

    // 🧠 Check if it's a Claude MCP tool-call
    if (req.body?.schema === "call-tool" && req.body?.params?.name === "wp_post") {
      input = req.body.params.arguments;
    } else {
      input = req.body; // fallback for Postman or manual tests
    }

    // ✅ Validate inputs
    const schema = z.object({
      title: z.string(),
      content: z.string(),
      image_url: z.string(),
      filename: z.string()
    });

    const parsed = schema.parse(input);

    // 📤 Send to your WordPress logic
    const result = await wp_post(parsed);

    // ✅ Return Claude-style result
    res.json({
      content: [
        {
          type: "text",
          text: result?.message || "✅ WordPress post published successfully."
        }
      ]
    });
  } catch (err) {
    console.error("❌ Error in /wp_post:", err.message);
    res.status(400).json({
      content: [
        { type: "text", text: `❌ Error: ${err.message}` }
      ]
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 MCP server running on port ${PORT}`);
});
