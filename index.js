#!/usr/bin/env node
import { FastMCP, StreamableHttpTransport } from "fastmcp";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const mcp = new FastMCP({
  name: "Simple Date Server",
  instructions: "This server returns the current server date and time.",
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
  host: "0.0.0.0",
});
transport.listen(mcp);

console.log(`✅ MCP server listening on http://0.0.0.0:${PORT}`);
