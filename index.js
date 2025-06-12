import express from "express";
import dotenv from "dotenv";
import { wp_post } from "./tools/wordpress.js";
import { z } from "zod";

dotenv.config();
const app = express();
app.use(express.json());

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
