# How It Works

This document provides a detailed explanation of how the Notion MCP Server works.

## Architecture Overview

The Notion MCP Server follows a client-server architecture:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│  MCP Client │ ◄─────► │  MCP Server │ ◄─────► │  Notion API │
│  (Cursor)   │         │             │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
```

1. **MCP Client** (e.g., Cursor): Sends requests to the server to perform operations on Notion
2. **MCP Server**: Processes requests, calls the Notion API, and returns responses
3. **Notion API**: The official API provided by Notion

## Communication Protocol

The Model Context Protocol (MCP) defines a standardized way for AI models to interact with external tools and resources. The communication happens through a JSON-RPC-like protocol:

1. The client sends a request with a method name and parameters
2. The server processes the request and executes the corresponding tool
3. The server returns a response with the result or an error

Example request:

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tool/search",
  "params": {
    "query": "project planning"
  }
}
```

Example response:

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"results\": [...], \"next_cursor\": null, \"has_more\": false}"
      }
    ]
  }
}
```

## Deployment Options

### 1. Local Subprocess (Recommended for Cursor)

In this mode, the server runs as a local subprocess, started on-demand by the client:

```
┌─────────────────────────────────┐
│                                 │
│  Client Application (Cursor)    │
│                                 │
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │  MCP Server (Subprocess)│    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

- **Communication**: Standard input/output (stdio)
- **Lifecycle**: Started when needed, terminated when done
- **Configuration**: Environment variables or .env file
- **Advantages**: Simple setup, no hosting required
- **Disadvantages**: Limited to local use

### 2. Hosted Service

In this mode, the server runs as a persistent service:

```
┌─────────────┐         ┌─────────────┐
│             │  HTTP/  │             │
│  MCP Client │ ◄─────► │  MCP Server │
│             │   SSE   │  (Hosted)   │
└─────────────┘         └─────────────┘
```

- **Communication**: HTTP/SSE (requires additional implementation)
- **Lifecycle**: Long-lived process
- **Configuration**: Environment variables or configuration file
- **Advantages**: Can be used by multiple clients, accessible over the network
- **Disadvantages**: More complex setup, requires hosting

## Authentication Flow

1. **Notion API Key**: The server uses a Notion API key to authenticate with the Notion API
2. **Environment Variable**: The key is stored in the `NOTION_API_KEY` environment variable
3. **Integration**: The key is associated with a Notion integration that has access to specific pages/databases
4. **Per-Request Authentication**: Each request to the Notion API includes the API key

## Server Components

### 1. MCP Server

The `NotionMCPServer` class is the main component of the server. It:

- Initializes the Notion service
- Registers tools for interacting with Notion
- Connects to a transport (stdio)

### 2. Notion Service

The `NotionService` class provides a wrapper around the Notion SDK. It:

- Initializes the Notion client with the API key
- Provides methods for interacting with the Notion API
- Handles error cases and type conversions

### 3. Transport

The transport handles the communication between the client and server. Currently, only the stdio transport is implemented:

- **StdioServerTransport**: Uses standard input/output for communication

## Tool Implementation

Each tool is implemented as a function that:

1. Takes parameters from the client
2. Calls the Notion API
3. Returns the result or an error

Example tool implementation:

```typescript
this.server.tool(
  "search",
  {
    query: z.string().optional().describe("The search query string"),
    // ... other parameters
  },
  async ({ query, filter_object_type, page_size }) => {
    try {
      const results = await this.notionService.search({
        query,
        filter: filter_object_type
          ? { property: "object", value: filter_object_type }
          : undefined,
        page_size,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error in search tool:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: Failed to search Notion - ${
              (error as Error).message
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);
```

## Error Handling

The server implements comprehensive error handling:

1. **Tool-Level Errors**: Each tool catches errors and returns them in a standardized format
2. **Transport Errors**: The transport handles communication errors
3. **Notion API Errors**: Errors from the Notion API are caught and returned to the client

## Performance Considerations

- **Stateless**: The server is stateless, so each request is independent
- **Caching**: No caching is implemented, so each request goes to the Notion API
- **Rate Limiting**: The Notion API has rate limits that apply to all requests

## Security Considerations

- **API Key**: The Notion API key should be kept secure
- **Access Control**: The Notion integration should only have access to the necessary pages/databases
- **Input Validation**: All input is validated using Zod schemas
