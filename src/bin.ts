#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { NotionMCPServer } from "./lib/mcp-server.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import os from "os";

// Parse command line arguments
const args = process.argv.slice(2);
const helpArg = args.includes("--help") || args.includes("-h");
const versionArg = args.includes("--version") || args.includes("-v");
const verboseArg = args.includes("--verbose");
const envPathIndex = args.findIndex((arg) => arg === "--env-path");
const envPath = envPathIndex !== -1 ? args[envPathIndex + 1] : null;
const apiKeyIndex = args.findIndex((arg) => arg.startsWith("--api-key="));
const apiKey = apiKeyIndex !== -1 ? args[apiKeyIndex].split("=")[1] : null;

// Show help text
if (helpArg) {
  console.log(`
Notion MCP Server - A Model Context Protocol server for Notion

USAGE:
  mcp-server-notion [OPTIONS]

OPTIONS:
  -h, --help              Show this help message
  -v, --version           Show version information
  --verbose               Enable verbose logging
  --env-path <path>       Path to .env file (default: ./.env or ~/.env)
  --api-key=<key>         Notion API key (overrides environment variable)

EXAMPLES:
  mcp-server-notion
  mcp-server-notion --verbose
  mcp-server-notion --env-path /path/to/.env
  mcp-server-notion --api-key=your_notion_api_key
  `);
  process.exit(0);
}

// Show version
if (versionArg) {
  const packageJson = JSON.parse(
    fs.readFileSync(
      path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        "../package.json"
      ),
      "utf8"
    )
  );
  console.log(`Notion MCP Server v${packageJson.version}`);
  process.exit(0);
}

// Load environment variables
try {
  // Try custom path if provided
  if (envPath) {
    if (!fs.existsSync(envPath)) {
      console.error(`Error: .env file not found at ${envPath}`);
      process.exit(1);
    }
    dotenv.config({ path: envPath });
  }
  // Try current directory
  else if (fs.existsSync(path.resolve(process.cwd(), ".env"))) {
    dotenv.config();
  }
  // Try home directory
  else {
    const homeDirEnv = path.join(os.homedir(), ".env");
    if (fs.existsSync(homeDirEnv)) {
      dotenv.config({ path: homeDirEnv });
    }
  }

  // Set API key from command line if provided
  if (apiKey) {
    process.env.NOTION_API_KEY = apiKey;
  }
} catch (error) {
  console.error("Error loading environment variables:", error);
  process.exit(1);
}

// Check for required environment variables
if (!process.env.NOTION_API_KEY) {
  console.error(`
Error: NOTION_API_KEY environment variable is not set.

Please set this variable in a .env file or in your environment.
You can create a .env file in the current directory or in your home directory with:

NOTION_API_KEY=your_notion_api_key

To obtain a Notion API key, visit: https://www.notion.so/my-integrations
  `);
  process.exit(1);
}

// Start the server
async function main() {
  try {
    if (verboseArg) {
      console.log("Starting Notion MCP Server...");
    }

    const server = new NotionMCPServer(process.env.NOTION_API_KEY);
    await server.connect(new StdioServerTransport());

    if (verboseArg) {
      console.log("Notion MCP Server started successfully");
    }
  } catch (error) {
    console.error("Error starting Notion MCP Server:", error);
    process.exit(1);
  }
}

main();
