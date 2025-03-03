# Notion MCP Server

A Model Context Protocol (MCP) server that exposes the official Notion SDK, allowing for seamless integration between AI models and Notion workspaces.

## Features

- Full implementation of the Model Context Protocol (MCP) specification
- Integration with the official Notion API via their SDK
- TypeScript-based architecture for type safety and developer experience
- Efficient context retrieval from Notion databases, pages, and blocks for AI model prompting
- Comprehensive error handling and logging

## How It Works

The Notion MCP Server acts as a bridge between AI models and the Notion API:

1. The server implements the Model Context Protocol (MCP)
2. It exposes Notion functionality as MCP tools
3. AI clients (like Cursor) can connect to the server and use these tools
4. The server handles authentication and communication with the Notion API

You can run the server as:

- A local subprocess (recommended for Cursor)
- A hosted service (requires additional setup)

For more details, see [How It Works](docs/HOW_IT_WORKS.md).

## Installation

### Global Installation (Recommended for Cursor)

```bash
# Install globally
npm install -g mcp-server-notion
```

### Local Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-server-notion.git
cd mcp-server-notion

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

Create a `.env` file in the root directory (or your home directory for global installation) with the following content:

```
NOTION_API_KEY=your_notion_api_key
```

You can obtain a Notion API key by creating an integration in the [Notion Integrations](https://www.notion.so/my-integrations) page.

## Usage

### Starting the Server Manually

```bash
# If installed globally
mcp-server-notion

# If installed locally
npm start
```

The server will start in stdio mode, which allows it to be used as a subprocess by MCP clients.

### Using with Cursor

Cursor has built-in support for MCP tools. Here's how to set it up:

1. **Install the package globally** (as shown above)

2. **Configure your Notion API key** (as shown above)

3. **Configure Cursor to use the MCP server**:
   - Open Cursor
   - Go to Settings > AI > Model Context Protocol
   - Add a new MCP tool with the following configuration:
     - **Name**: Notion
     - **Command**: mcp-server-notion
     - **Arguments**: (leave empty)

Once configured, you can use the Notion tools directly in Cursor's AI chat:

```
@Cursor Can you search my Notion workspace for documents about "project planning"?
```

For more detailed instructions, see [Using with Cursor](docs/CURSOR_INTEGRATION.md).
For rules and best practices when using MCP servers with Cursor, see [Cursor Rules for MCP Servers](docs/CURSOR_RULES.md).

### Available Tools

The server exposes the following tools:

#### Search

- `search`: Search for pages or databases in a Notion workspace

#### Database Operations

- `query-database`: Query a Notion database with optional filters and sorting
- `get-database`: Retrieve a Notion database by ID

#### Page Operations

- `create-page`: Create a new page in Notion
- `get-page`: Retrieve a Notion page by ID
- `update-page`: Update a Notion page

#### Block Operations

- `append-blocks`: Add content blocks to a page or block
- `get-block`: Retrieve a block by ID
- `get-block-children`: Retrieve children blocks of a block or page
- `update-block`: Update a block
- `delete-block`: Delete (archive) a block

For detailed documentation on each tool, see [Tool Documentation](docs/TOOLS.md).

## Development

### Building the Project

```bash
# Build the project
npm run build
```

### Running in Development Mode

```bash
# Run with auto-reload on changes
npm run dev
```

### Running Tests

```bash
# Run tests
npm test
```

## Documentation

- [Project Structure](docs/STRUCTURE.md) - Overview of the codebase structure
- [MCP Integration](docs/MCP.md) - Details on the Model Context Protocol implementation
- [How It Works](docs/HOW_IT_WORKS.md) - Detailed explanation of the server architecture
- [Cursor Integration](docs/CURSOR_INTEGRATION.md) - Guide for using with Cursor
- [Cursor Rules for MCP Servers](docs/CURSOR_RULES.md) - Rules and best practices for working with MCP servers in Cursor
- [Tool Documentation](docs/TOOLS.md) - Detailed documentation for each tool

## Troubleshooting

If you encounter issues:

1. **Check your Notion API key**: Make sure it's correctly set in the `.env` file
2. **Verify permissions**: Ensure your integration has access to the pages/databases you're trying to access
3. **Check logs**: Run the server manually to see any error messages
4. **Update the package**: Make sure you're using the latest version

## License

MIT
