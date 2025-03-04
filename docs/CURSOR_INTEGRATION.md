# Using with Cursor

This guide explains how to set up and use the Notion MCP Server with Cursor.

## What is Cursor?

[Cursor](https://cursor.sh/) is an AI-powered code editor based on VS Code that integrates large language models (LLMs) to help with coding tasks. Cursor supports the Model Context Protocol (MCP), allowing it to use external tools like our Notion MCP Server.

## Setup Instructions

### 1. Configure Your Notion API Key

To use the Notion MCP Server with Cursor, you'll need a Notion API key:

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Cursor Integration")
4. Select the capabilities it needs (at minimum: Read content, Read user information, Read comments)
5. Click "Submit"
6. Copy the "Internal Integration Token" (this is your API key)

### 2. Share Notion Content with Your Integration

For your integration to access Notion content:

1. Open a Notion page or database you want to access
2. Click "Share" in the top right
3. Click "Invite" and find your integration name
4. Click "Invite"

Repeat this for all pages and databases you want to access.

### 3. Configure Cursor

1. Open Cursor
2. Go to Settings (gear icon in the bottom left)
3. Navigate to AI > Model Context Protocol
4. Click "Add Tool"
5. Fill in the following details:
   - **Name**: Notion
   - **Command**: npx @ecovirtual/mcp-server-notion@latest -y --api-key=your_notion_api_key
   - **Arguments**: (leave empty)
6. Click "Save"

Alternatively, if you prefer to use an environment file:

1. Create a `.env` file in your home directory with your Notion API key:
   ```
   NOTION_API_KEY=your_notion_api_key
   ```
   Note: When using an environment file, the variable name must be `NOTION_API_KEY` (not `--api-key`).
2. Configure Cursor with:
   - **Command**: npx @ecovirtual/mcp-server-notion@latest -y
   - **Arguments**: (leave empty)

### Troubleshooting "Failed to create client" Error

If you encounter the "Failed to create client" error when adding the Notion MCP server to Cursor, try these solutions:

1. **Use the full path to npx**:

   - Find the full path to your npx executable: `which npx`
   - Use the full path in the command: `/path/to/npx @ecovirtual/mcp-server-notion@latest -y --api-key=your_notion_api_key`

2. **Use cmd.exe wrapper on Windows**:

   - On Windows, try: `cmd /c npx @ecovirtual/mcp-server-notion@latest -y --api-key=your_notion_api_key`

3. **Check Node.js version**:

   - Ensure you have Node.js v16 or later installed
   - Run `node -v` in your terminal to verify

4. **Create a shell script wrapper**:

   - Create a shell script (e.g., `notion-mcp.sh`) with the following content:
     ```bash
     #!/bin/bash
     export NOTION_API_KEY=your_notion_api_key
     npx @ecovirtual/mcp-server-notion@latest -y
     ```
     Note: In the shell script, use `NOTION_API_KEY` as the environment variable name.
   - Make it executable: `chmod +x notion-mcp.sh`
   - Use the script in Cursor: `/path/to/notion-mcp.sh`

5. **Verify API key format**:

   - Ensure your API key doesn't contain any special characters or spaces
   - Make sure you're using the correct format: `--api-key=your_notion_api_key` (with the equals sign, no spaces)
   - If you're having issues, try using the environment file approach instead

6. **Restart Cursor**:

   - Sometimes a simple restart of Cursor can resolve connection issues

7. **Check for conflicting tools**:
   - Remove any other MCP servers that might be conflicting
   - Add them back one by one to identify any conflicts

## Using Notion in Cursor

Once configured, you can use Notion directly in Cursor's AI chat panel.

### Basic Usage

Simply ask Cursor to perform Notion operations:

```
@Cursor Can you search my Notion workspace for documents about "project planning"?
```

```
@Cursor Create a new page in my Notion with the title "Meeting Notes" and add some bullet points about our discussion.
```

### Working with Databases

To work with databases, you'll need to know the database ID. You can find this in the URL of your database:

```
https://www.notion.so/workspace/abc123def456...
```

The ID is the part after the last slash (and before any query parameters).

Example usage:

```
@Cursor Query my project database with ID "abc123def456" and show me all tasks with status "In Progress"
```

### Working with Pages

Similarly, you'll need page IDs for specific page operations:

```
@Cursor Get the content of my Notion page with ID "abc123def456"
```

### Advanced Usage

You can also use more complex operations by specifying the exact tool and parameters:

```
@Cursor Use the Notion tool "append-blocks" to add a to-do list to my page with ID "abc123def456" with the following items: Buy groceries, Clean the house, Pay bills
```

## Example Workflows

### Research Assistant

```
@Cursor Search my Notion workspace for information about "machine learning" and summarize the key points.
```

### Note Taking

```
@Cursor Create a new page in my Notion with today's date as the title and add these meeting notes: [your notes]
```

### Task Management

```
@Cursor Query my project database and show me all tasks with status "In Progress", then create a summary of what I'm currently working on.
```

### Content Creation

```
@Cursor Help me draft a blog post about TypeScript best practices, then save it to my Notion workspace.
```

## Rules and Best Practices

For detailed rules and best practices when working with MCP servers in Cursor, please refer to the [Cursor Rules for MCP Servers](CURSOR_RULES.md) document. This guide covers:

- Configuration rules
- Usage patterns
- Context handling
- Error handling strategies
- Performance guidelines
- Security best practices
- Troubleshooting tips
- Advanced usage scenarios

## Troubleshooting

### Common Issues

1. **"Tool not found" error**:

   - Make sure you're using the correct npx command: `npx @ecovirtual/mcp-server-notion@latest -y`
   - Check that the tool name in Cursor settings matches exactly what's shown above

2. **Authentication errors**:

   - Verify your Notion API key is correct
   - If using the `--api-key` parameter, make sure it's properly formatted
   - If using an environment file, check that the `.env` file is in the right location

3. **Permission errors**:

   - Ensure you've shared the relevant pages/databases with your integration

4. **Rate limiting**:
   - The Notion API has rate limits; if you hit them, wait a few minutes and try again

### Debugging

To debug issues, you can run the server manually and observe its output:

```bash
npx @ecovirtual/mcp-server-notion@latest -y --verbose
```

Then try making requests to see if there are any error messages.

## Advanced Configuration

### Custom Environment File Location

You can specify a custom location for your `.env` file:

```bash
npx @ecovirtual/mcp-server-notion@latest -y --env-path /path/to/.env
```

### Direct API Key Usage

You can provide the API key directly without using an environment file:

```bash
npx @ecovirtual/mcp-server-notion@latest -y --api-key=your_notion_api_key
```

### Logging

To enable verbose logging:

```bash
npx @ecovirtual/mcp-server-notion@latest -y --verbose
```

## Limitations

- The server currently only supports stdio transport
- Some complex Notion features might not be fully supported
- Rate limits from the Notion API apply
- The server doesn't maintain state between requests
