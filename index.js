#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import { StreamableHttpTransport } from "fastmcp/transports/http";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const mcp = new FastMCP({
  name: "Simple Date Server",
  instructions: "This server returns the current server date and time.",
});

// Add logging for Claude's calls
mcp.on("list", () => {
  console.log("🔍 Claude is requesting list-tools");
});
mcp.on("call", ({ name }) => {
  console.log(`📞 Claude is calling: ${name}`);
});

// Define the tool
mcp.tool({
  name: "get_date",
  description: "Get the current server date and time in ISO format.",
  inputSchema: z.object({}),
  outputSchema: z.object({ message: z.string() }),
  execute: async () => {
    const now = new Date().toISOString();
    return { message: `The current server date and time is ${now}` };
  },
});

// Start server
const transport = new StreamableHttpTransport({
  port: PORT,
  host: "0.0.0.0", // Required for Render
});
transport.listen(mcp);

console.log(`✅ MCP server listening on http://0.0.0.0:${PORT}`);
