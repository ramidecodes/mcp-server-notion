#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { NotionMCPServer } from "./lib/mcp-server.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  // Parse command-line arguments
  const notionApiKey = process.env.NOTION_API_KEY;

  if (!notionApiKey) {
    console.error("Error: NOTION_API_KEY environment variable not set");
    process.exit(1);
  }

  // Create the server instance
  const server = new NotionMCPServer(notionApiKey);

  try {
    console.log("Starting stdio MCP server");
    await server.connect(new StdioServerTransport());
  } catch (error) {
    console.error("Error starting MCP server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
