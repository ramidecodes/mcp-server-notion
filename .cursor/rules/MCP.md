# MCP Server Rules for Cursor AI

## Overview

This rules file defines how Cursor AI should interact with the Model Context Protocol (MCP) server for Notion. These rules help Cursor AI understand the capabilities and limitations of the Notion MCP server.

## Server Information

- **Name**: Notion MCP Server
- **Purpose**: Provides access to Notion workspaces via the Model Context Protocol
- **Transport**: stdio (standard input/output)
- **Authentication**: Requires a Notion API key provided via command-line parameter `--api-key` or stored in environment variable `NOTION_API_KEY`
- **Installation**: Run directly via `npx @ecovirtual/mcp-server-notion@latest -y --api-key=your_notion_api_key`

## Command Format Best Practices

- Always use the `@latest` tag to ensure you're using the most recent version
- Include the `-y` flag to skip confirmation prompts
- When using the `--api-key` parameter, use the format `--api-key=your_notion_api_key` (with equals sign, no spaces)
- When using environment variables, set `NOTION_API_KEY` (not `--api-key`)
- On Windows, prefix with `cmd /c` to ensure proper execution: `cmd /c npx @ecovirtual/mcp-server-notion@latest -y --api-key=your_notion_api_key`
- On macOS/Linux, consider using the full path to npx if you encounter issues
- For troubleshooting "Failed to create client" errors, try creating a shell script wrapper

## Available Tools

### Search Tools

- `search`: Search for pages or databases in a Notion workspace
  - Parameters: `query` (string), `filter_object_type` (string), `page_size` (number)

### Database Tools

- `query-database`: Query a Notion database with optional filters and sorting
  - Parameters: `database_id` (string), `filter` (string), `sorts` (string), `page_size` (number), `start_cursor` (string)
- `get-database`: Retrieve a Notion database by ID
  - Parameters: `database_id` (string)

### Page Tools

- `create-page`: Create a new page in Notion
  - Parameters: `parent_type` (string), `parent_id` (string), `properties` (string), `children` (string)
- `get-page`: Retrieve a Notion page by ID
  - Parameters: `page_id` (string)
- `update-page`: Update a Notion page
  - Parameters: `page_id` (string), `properties` (string), `archived` (boolean)

### Block Tools

- `append-blocks`: Add content blocks to a page or block
  - Parameters: `block_id` (string), `children` (string)
- `get-block`: Retrieve a block by ID
  - Parameters: `block_id` (string)
- `get-block-children`: Retrieve children blocks of a block or page
  - Parameters: `block_id` (string), `page_size` (number), `start_cursor` (string)
- `update-block`: Update a block
  - Parameters: `block_id` (string), `properties` (string)
- `delete-block`: Delete (archive) a block
  - Parameters: `block_id` (string)

## Usage Patterns

### Natural Language Queries

When the user asks about Notion content, use the `search` tool first to find relevant pages or databases.

Example:

```
User: Find my notes about project planning
Action: Use the search tool with query="project planning"
```

### Database Operations

When working with databases, first get the database structure with `get-database`, then query it with `query-database`.

Example:

```
User: Show me all tasks with status "In Progress"
Action:
1. Use search to find the tasks database
2. Use get-database to understand its structure
3. Use query-database with appropriate filters
```

### Content Creation

For creating content, use `create-page` for new pages and `append-blocks` for adding content to existing pages.

Example:

```
User: Create a new page with today's meeting notes
Action: Use create-page with appropriate properties and children blocks
```

## Response Handling

- All responses are JSON strings that should be parsed before presenting to the user
- Large responses should be summarized or formatted for better readability
- Error responses include an `isError` flag and should be presented clearly to the user

## Error Handling

- Authentication errors: Prompt the user to check their Notion API key
- Permission errors: Suggest sharing the relevant pages/databases with the integration
- Rate limiting: Inform the user and suggest trying again later
- Invalid parameters: Provide clear guidance on the correct parameter format

## Limitations

- The server cannot access pages/databases that haven't been shared with the integration
- Complex Notion features like comments and user mentions may have limited support
- Rate limits from the Notion API apply (approximately 3 requests per second)
- The server doesn't maintain state between requests

## Best Practices

- Use IDs consistently: Always use the same ID format (UUID without hyphens)
- Minimize requests: Combine operations when possible to reduce API calls
- Handle pagination: For large datasets, use pagination parameters
- Format JSON: When showing JSON to users, format it for readability
- Validate input: Ensure parameters match the expected format before sending
