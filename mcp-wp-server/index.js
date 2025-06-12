import { Server } from "@modelcontextprotocol/sdk/server";
import dotenv from "dotenv";
import { wp_post } from "./tools/wordpress.js";

dotenv.config();

const server = new Server({
  name: "WordPress MCP Server",
  instructions: "Use this to post directly to WordPress with an image.",
  tools: [
    {
      name: "wp_post",
      description: "Post to WordPress with optional image.",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          image_url: { type: "string" },
          filename: { type: "string" }
        },
        required: ["title", "content", "image_url", "filename"]
      },
      func: wp_post
    }
  ]
});

server.listen(3000);
