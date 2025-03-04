# Notion MCP Server

A Model Context Protocol (MCP) server that exposes the official Notion SDK, allowing AI models to interact with Notion workspaces.

## Quick Start

### 1. Set up your Notion integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the API key

### 2. Add to Claude Desktop or Cursor AI

Add the following command to your AI assistant's MCP server configuration:

```bash
npx @ramidecodes/mcp-server-notion@latest -y --api-key=your-notion-integration-key
```

Replace `your-notion-integration-key` with the API key from step 1.

## Integration Guide

### For Claude Desktop

1. Open Claude Desktop
2. Go to Settings > Advanced > Model Context Protocol
3. Add a new MCP server with the command above
4. Save and restart Claude

### For Cursor AI

1. Open Cursor AI
2. Go to Settings > AI > MCP Servers
3. Add a new MCP server with the command above
4. Save settings

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
