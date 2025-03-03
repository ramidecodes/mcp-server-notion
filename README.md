# Notion MCP Server

A Model Context Protocol (MCP) server that exposes the official Notion SDK.

## Overview

This package provides a Model Context Protocol (MCP) server implementation that wraps the official Notion SDK, allowing AI models to interact with Notion workspaces through a standardized interface.

## Features

- **Full Notion API Support**: Leverages the official Notion SDK to provide access to all Notion API features
- **MCP Compliant**: Implements the Model Context Protocol for seamless integration with AI models
- **Comprehensive Tools**: Provides tools for searching, querying databases, creating and updating pages, managing blocks, working with users, and handling comments
- **Robust Error Handling**: Includes detailed error messages and proper error handling
- **Type Safety**: Uses TypeScript and Zod for type validation and safety
- **Easy Configuration**: Simple setup with environment variables

## Installation

```bash
npm install mcp-server-notion
# or
yarn add mcp-server-notion
# or
pnpm add mcp-server-notion
```

## Quick Start

### 1. Set up your Notion integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the API key

### 2. Create a `.env` file

```
NOTION_API_KEY=your_notion_api_key
```

### 3. Run the server

```bash
npx mcp-server-notion
```

## Usage

### Command Line Options

```
Notion MCP Server - A Model Context Protocol server for Notion

USAGE:
  mcp-server-notion [OPTIONS]

OPTIONS:
  -h, --help              Show this help message
  -v, --version           Show version information
  --verbose               Enable verbose logging
  --env-path <path>       Path to .env file (default: ./.env or ~/.env)

EXAMPLES:
  mcp-server-notion
  mcp-server-notion --verbose
  mcp-server-notion --env-path /path/to/.env
```

### Programmatic Usage

```typescript
import { NotionMCPServer } from "mcp-server-notion";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Initialize the server
const server = new NotionMCPServer();

// Connect to a transport
await server.connect(new StdioServerTransport());
```

## Available Tools

The server provides the following tools for interacting with Notion:

### Search Tools

- `search`: Search for pages or databases in Notion

### Database Tools

- `query-database`: Query a database to retrieve entries
- `get-database`: Retrieve a database by ID

### Page Tools

- `create-page`: Create a new page in a database or as a child of another page
- `get-page`: Retrieve a page by ID
- `update-page`: Update page properties

### Block Tools

- `append-blocks`: Add content blocks to a page or block
- `get-block`: Retrieve a block by ID
- `get-block-children`: Retrieve the children of a block
- `update-block`: Update a block
- `delete-block`: Delete a block (set archived to true)

### User Tools

- `list-users`: List all users in the workspace
- `get-user`: Retrieve a user by ID
- `get-me`: Retrieve the bot user associated with the current API token

### Comment Tools

- `create-comment`: Create a comment on a page
- `list-comments`: List comments on a page or block

### Link Preview Tools

- `create-link-preview`: Create a link preview for a URL

For detailed documentation on each tool, including parameters and examples, see the [Tools Documentation](docs/TOOLS.md).

## Integration with Cursor

This MCP server is designed to work seamlessly with [Cursor](https://cursor.sh/), an AI-powered code editor. To use this server with Cursor, follow the instructions in the [Cursor Rules Documentation](docs/CURSOR_RULES.md).

## Project Structure

The project is organized as follows:

```
mcp-server-notion/
├── src/
│   ├── bin.ts                # Command-line interface
│   ├── index.ts              # Main exports
│   ├── lib/
│   │   ├── mcp-server.ts     # MCP server implementation
│   │   └── notion.ts         # Notion service
│   └── types/
│       └── notion.ts         # Type definitions
├── docs/
│   ├── TOOLS.md              # Tool documentation
│   ├── CURSOR_RULES.md       # Cursor integration guide
│   └── STRUCTURE.md          # Project structure documentation
└── .env.example              # Example environment variables
```

## Error Handling

The server includes robust error handling for all Notion API interactions. Errors are properly caught, logged, and returned to the client with descriptive messages.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
