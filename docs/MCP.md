# Model Context Protocol (MCP)

## Overview

The Model Context Protocol (MCP) is a standardized communication protocol designed to enable AI models to interact with external tools and services. It provides a structured way for AI models to request information or perform actions in the real world, extending their capabilities beyond their training data.

In the context of this project, MCP allows AI models (like those used in Cursor) to interact with Notion, enabling them to search, read, and write content in Notion workspaces.

## Key Concepts

### Tools

In MCP, a "tool" is a function that an AI model can call to perform a specific action or retrieve specific information. Each tool has:

- A name (e.g., "search", "query-database")
- A set of parameters it accepts
- A specific response format

The Notion MCP Server implements tools for various Notion operations, such as searching for content, querying databases, and creating or updating pages.

### Requests and Responses

MCP uses a JSON-RPC-like format for communication:

**Request Format:**

```json
{
  "name": "tool-name",
  "params": {
    "param1": "value1",
    "param2": "value2"
  }
}
```

**Response Format:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Response content"
    }
  ],
  "isError": false
}
```

If an error occurs, the response includes an `isError` flag set to `true` and an error message in the content.

### Transport

MCP can operate over different transport mechanisms:

1. **Standard Input/Output (stdio)**: Used when the MCP server runs as a subprocess of the AI model's application. This is the recommended approach for Cursor integration.

2. **HTTP**: Used when the MCP server runs as a separate service that the AI model's application connects to over the network.

The Notion MCP Server primarily uses stdio transport for integration with Cursor.

## MCP in the Notion MCP Server

### Server Implementation

The Notion MCP Server implements the MCP specification using the `@modelcontextprotocol/sdk` package. The core implementation is in the `NotionMCPServer` class, which:

1. Initializes an MCP server with specific capabilities
2. Registers tools for various Notion operations
3. Connects to a transport (stdio or HTTP)
4. Handles incoming requests and routes them to the appropriate tool handlers

### Tool Registration

Tools are registered with the MCP server using the `registerTool` method. Each tool registration includes:

- The tool name
- A schema defining the parameters the tool accepts
- A handler function that processes requests and returns responses

Example tool registration:

```typescript
this.server.registerTool({
  name: "search",
  parameters: z.object({
    query: z.string().optional(),
    filter_object_type: z.string().optional(),
    page_size: z.number().optional(),
  }),
  handler: async (request) => {
    try {
      const result = await this.notionService.search(request.params);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Failed to search Notion - ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
});
```

### Error Handling

The MCP server includes robust error handling to ensure that errors in tool execution are properly communicated back to the AI model. Each tool handler wraps its implementation in a try-catch block and returns appropriate error responses when exceptions occur.

## Using MCP with Cursor

Cursor is an AI-powered code editor that can integrate with MCP-compatible tools. To use the Notion MCP Server with Cursor:

1. Install and configure the Notion MCP Server
2. Add the Notion tool in Cursor's settings
3. Use natural language to ask Cursor to perform Notion operations

For detailed instructions, see the [Cursor Integration Guide](CURSOR_INTEGRATION.md).

## Benefits of MCP

Using MCP for AI-tool integration provides several benefits:

1. **Standardization**: MCP provides a consistent interface for AI models to interact with external tools.

2. **Extensibility**: New tools can be added to the MCP server without changing the AI model or the communication protocol.

3. **Security**: MCP includes mechanisms for authentication and authorization, ensuring that AI models can only access the tools and data they are permitted to.

4. **Interoperability**: Different AI models and applications can use the same MCP server, promoting reuse and consistency.

## Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Cursor Documentation](https://cursor.sh/docs)
