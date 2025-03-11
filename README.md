# Notion MCP Server

A Model Context Protocol (MCP) server that exposes the official Notion SDK, allowing AI models to interact with Notion workspaces.

<a href="https://glama.ai/mcp/servers/bjc5iac7gt">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/bjc5iac7gt/badge" alt="Notion Server MCP server" />
</a>

## Quick Start

### 1. Set up your Notion integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the API key

### 2. Add to your AI assistant

You can add this MCP server to Claude Desktop, Cursor AI, or Claude.ai using either of these configuration formats:

#### Command Line Format

```bash
npx @ramidecodes/mcp-server-notion@latest -y --api-key=your-notion-integration-key
```

#### JSON Configuration Format

```json
{
  "name": "Notion",
  "command": {
    "args": [
      "@ramidecodes/mcp-server-notion@latest",
      "-y",
      "--api-key=your-notion-integration-key"
    ],
    "env": {},
    "executable": "npx"
  }
}
```

Replace `your-notion-integration-key` with the API key from step 1.

### Setup Instructions

- **Claude Desktop**: Settings > Advanced > Model Context Protocol
- **Cursor AI**: Settings > AI > MCP Servers
- **Claude.ai (Web)**: Profile > Settings > API & Integrations > Model Context Protocol

## Available Tools

The server provides tools for interacting with Notion:

- **Search**: Find pages or databases
- **Databases**: Query and retrieve database entries
- **Pages**: Create, retrieve, and update pages
- **Blocks**: Manage content blocks (paragraphs, lists, etc.)
- **Users**: List users and get user information
- **Comments**: Create and list comments
- **Link Previews**: Create link previews for URLs

## Alternative Setup Methods

### Using Environment Variables

Instead of passing the API key directly, you can use a `.env` file:

1. Create a `.env` file with:

```
NOTION_API_KEY=your-notion-integration-key
```

2. Run the server:

```bash
npx @ramidecodes/mcp-server-notion@latest -y
```

#### JSON Configuration with Environment Variables (for Claude Desktop)

You can also use environment variables in the JSON configuration format:

```json
{
  "name": "Notion",
  "command": {
    "args": ["@ramidecodes/mcp-server-notion@latest", "-y"],
    "env": {
      "NOTION_API_KEY": "your-notion-integration-key"
    },
    "executable": "npx"
  }
}
```

### Command Line Options

```
OPTIONS:
  -h, --help              Show help message
  -v, --version           Show version information
  --verbose               Enable verbose logging
  --env-path <path>       Path to .env file
  --api-key <key>         Notion API key
  -y                      Skip confirmation prompts
```

## Troubleshooting

If you encounter "Failed to create client" errors:

- On Windows, try using `cmd /c` before the npx command
- On macOS/Linux, try using the full path to npx
- Test the command in a terminal before adding it to your AI assistant

## Features

- Full Notion API support through the official SDK
- MCP compliant for seamless AI integration
- Comprehensive tools for all Notion operations
- Robust error handling with detailed messages
- Easy configuration with environment variables

For detailed documentation on each tool, see the [Tools Documentation](docs/TOOLS.md).

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
