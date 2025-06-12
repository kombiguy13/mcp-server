import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import dotenv from "dotenv";
import { wp_post } from "./tools/wordpress.js";
import { z } from "zod";

dotenv.config();

const server = new McpServer({
  name: "WordPress MCP Server",
  version: "1.0.0"
});

server.tool("wp_post", {
  title: z.string(),
  content: z.string(),
  image_url: z.string(),
  filename: z.string()
}, wp_post);

// Start the server using the appropriate transport
// For example, using stdio transport:
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const transport = new StdioServerTransport();
await server.connect(transport);
