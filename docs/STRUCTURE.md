# Project Structure

This document provides an overview of the Notion MCP Server project structure.

## Directory Structure

```
mcp-server-notion/
├── docs/                      # Documentation files
│   ├── CURSOR_INTEGRATION.md  # Guide for using with Cursor
│   ├── CURSOR_RULES.md        # Rules for working with MCP servers in Cursor
│   ├── HOW_IT_WORKS.md        # Detailed explanation of server architecture
│   ├── MCP.md                 # Information about Model Context Protocol
│   ├── STRUCTURE.md           # This file - project structure overview
│   └── TOOLS.md               # Documentation for available tools
├── src/                       # Source code
│   ├── index.ts               # Entry point for the application
│   └── lib/                   # Core libraries and services
│       ├── mcp-server.ts      # MCP server implementation
│       └── notion.ts          # Notion API service
├── .env.example               # Example environment variables
├── .gitignore                 # Git ignore file
├── package.json               # Project dependencies and scripts
├── README.md                  # Project overview and usage instructions
└── tsconfig.json              # TypeScript configuration
```

## Key Files and Their Purposes

### Entry Point

- **src/index.ts**: The main entry point for the application. It initializes the Notion MCP Server and starts listening for requests.

### Core Libraries

- **src/lib/mcp-server.ts**: Implements the `NotionMCPServer` class, which integrates the Model Context Protocol with Notion API functionality. This file defines all the available tools and their handlers.

- **src/lib/notion.ts**: Implements the `NotionService` class, which provides methods for interacting with the Notion API. This service is used by the MCP server to execute operations on Notion.

### Configuration Files

- **.env.example**: Contains example environment variables needed for the application, such as the Notion API key.

- **tsconfig.json**: TypeScript configuration for the project, specifying compiler options and build settings.

- **package.json**: Defines project dependencies, scripts for building and running the application, and other metadata.

### Documentation

- **README.md**: Provides an overview of the project, installation instructions, usage examples, and other essential information.

- **docs/HOW_IT_WORKS.md**: Detailed explanation of the server architecture, communication protocol, and implementation details.

- **docs/CURSOR_INTEGRATION.md**: Guide for using the Notion MCP Server with Cursor, including setup instructions and usage examples.

- **docs/CURSOR_RULES.md**: Comprehensive rules and best practices for working with MCP servers in Cursor, including configuration, usage patterns, and troubleshooting.

- **docs/MCP.md**: Information about the Model Context Protocol, its purpose, and how it's implemented in this project.

- **docs/TOOLS.md**: Comprehensive documentation for all tools available in the Notion MCP Server, including parameters, examples, and responses.

## Code Structure

### NotionMCPServer Class

The `NotionMCPServer` class in `src/lib/mcp-server.ts` is the core of the application. It:

1. Initializes the MCP server with specific capabilities
2. Registers tools for various Notion operations
3. Implements request handlers for each tool
4. Manages error handling and response formatting

### NotionService Class

The `NotionService` class in `src/lib/notion.ts` provides a clean interface for interacting with the Notion API. It:

1. Manages authentication with the Notion API
2. Implements methods for each Notion API operation
3. Handles error cases and provides meaningful error messages
4. Formats responses from the Notion API

## Build and Runtime Structure

When built, the TypeScript code is compiled to JavaScript in a `dist` directory. The compiled code maintains the same structure as the source code.

The server can be run in two modes:

1. As a local subprocess (recommended for Cursor integration)
2. As a hosted service

In both cases, the server communicates using the Model Context Protocol over standard input/output or HTTP, depending on the deployment mode.
