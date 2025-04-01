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

### 2. Connect your Notion pages to the integration

For your integration to access Notion content, you need to explicitly share your pages or databases with it:

1. Navigate to the Notion page or database you want to access through the integration
2. Click the "Share" button in the top-right corner
3. In the "Add people, groups, or integrations" field, select your integration from the dropdown list
4. Click "Invite"
5. Repeat for each page or database you want to make accessible

**Note:** An integration only has access to pages and databases that have been explicitly shared with it. Child pages automatically inherit access from parent pages.

### 3. Add to your AI assistant

You can add this MCP server to Claude Desktop, Cursor AI, or Claude.ai using either of these configuration formats:

#### Command Line Format

```bash
npx @ramidecodes/mcp-server-notion@latest -y --api-key=your-notion-integration-key
```

#### JSON Configuration Format

```json
{
  "mcpServers": {
    "Notion": {
      "command": "npx",
      "args": [
        "@ramidecodes/mcp-server-notion@latest",
        "-y",
        "--api-key=your-notion-integration-key"
      ]
    }
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
  "mcpServers": {
    "Notion": {
      "command": "npx",
      "args": [
        "@ramidecodes/mcp-server-notion@latest",
        "-y",
        "--api-key=your-notion-integration-key"
      ]
    }
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

### Common Issues

- **"No access to resource" errors**: Make sure you've shared the specific Notion page or database with your integration (see step 2)
- **Integration not appearing in share menu**: Try refreshing the page or restarting your browser
- **Limited capabilities**: Check that your integration has the appropriate capabilities enabled in the Notion integration settings

## Features

- Full Notion API support through the official SDK
- MCP compliant for seamless AI integration
- Comprehensive tools for all Notion operations
- Robust error handling with detailed messages
- Easy configuration with environment variables

For detailed documentation on each tool, see the [Tools Documentation](docs/TOOLS.md).

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
