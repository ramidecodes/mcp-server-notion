# Notion MCP Server Tools Documentation

This document provides detailed information about the tools available in the Notion MCP Server, including their parameters, example requests, and example responses.

## Table of Contents

- [Search Tools](#search-tools)
- [Database Tools](#database-tools)
- [Page Tools](#page-tools)
- [Block Tools](#block-tools)
- [User Tools](#user-tools)
- [Comment Tools](#comment-tools)
- [Error Handling](#error-handling)
- [Working with Notion API Objects](#working-with-notion-api-objects)

## Search Tools

### `search`

Search for pages or databases in Notion.

**Parameters:**

- `query` (optional): The search query string
- `filter_object_type` (optional): Filter by object type (`page` or `database`)
- `page_size` (optional): Number of results to return (max 100)

**Example Request:**

```json
{
  "query": "Project Plan",
  "filter_object_type": "page",
  "page_size": 10
}
```

**Example Response:**

```json
{
  "object": "list",
  "results": [
    {
      "object": "page",
      "id": "page_id",
      "created_time": "2023-01-01T00:00:00.000Z",
      "last_edited_time": "2023-01-02T00:00:00.000Z",
      "parent": { "type": "database_id", "database_id": "database_id" },
      "archived": false,
      "properties": { ... },
      "url": "https://www.notion.so/..."
    }
  ],
  "next_cursor": null,
  "has_more": false
}
```

## Database Tools

### `query-database`

Query a database to retrieve entries.

**Parameters:**

- `database_id`: The ID of the database to query
- `filter` (optional): Filter conditions for the query
- `sorts` (optional): Sort conditions for the query
- `page_size` (optional): Number of results to return (max 100)
- `start_cursor` (optional): Pagination cursor

**Example Request:**

```json
{
  "database_id": "database_id",
  "filter": {
    "property": "Status",
    "select": {
      "equals": "Done"
    }
  },
  "sorts": [
    {
      "property": "Priority",
      "direction": "descending"
    }
  ],
  "page_size": 10
}
```

**Example Response:**

```json
{
  "object": "list",
  "results": [
    {
      "object": "page",
      "id": "page_id",
      "created_time": "2023-01-01T00:00:00.000Z",
      "last_edited_time": "2023-01-02T00:00:00.000Z",
      "parent": { "type": "database_id", "database_id": "database_id" },
      "archived": false,
      "properties": { ... },
      "url": "https://www.notion.so/..."
    }
  ],
  "next_cursor": null,
  "has_more": false
}
```

### `get-database`

Retrieve a database by ID.

**Parameters:**

- `database_id`: The ID of the database to retrieve

**Example Request:**

```json
{
  "database_id": "database_id"
}
```

**Example Response:**

```json
{
  "object": "database",
  "id": "database_id",
  "created_time": "2023-01-01T00:00:00.000Z",
  "last_edited_time": "2023-01-02T00:00:00.000Z",
  "title": [ ... ],
  "properties": { ... },
  "parent": { "type": "page_id", "page_id": "page_id" },
  "url": "https://www.notion.so/..."
}
```

## Page Tools

### `create-page`

Create a new page in a database or as a child of another page.

**Parameters:**

- `parent_type`: Type of parent (`database_id` or `page_id`)
- `parent_id`: ID of the parent database or page
- `properties`: Page properties (varies based on parent type)
- `children` (optional): Content blocks for the page
- `icon` (optional): Page icon
- `cover` (optional): Page cover image

**Example Request:**

```json
{
  "parent_type": "database_id",
  "parent_id": "database_id",
  "properties": {
    "Name": {
      "title": [
        {
          "text": {
            "content": "New Task"
          }
        }
      ]
    },
    "Status": {
      "select": {
        "name": "In Progress"
      }
    }
  },
  "children": [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "This is a new task."
            }
          }
        ]
      }
    }
  ]
}
```

**Example Response:**

```json
{
  "object": "page",
  "id": "page_id",
  "created_time": "2023-01-01T00:00:00.000Z",
  "last_edited_time": "2023-01-01T00:00:00.000Z",
  "parent": { "type": "database_id", "database_id": "database_id" },
  "archived": false,
  "properties": { ... },
  "url": "https://www.notion.so/..."
}
```

### `get-page`

Retrieve a page by ID.

**Parameters:**

- `page_id`: The ID of the page to retrieve

**Example Request:**

```json
{
  "page_id": "page_id"
}
```

**Example Response:**

```json
{
  "object": "page",
  "id": "page_id",
  "created_time": "2023-01-01T00:00:00.000Z",
  "last_edited_time": "2023-01-02T00:00:00.000Z",
  "parent": { "type": "database_id", "database_id": "database_id" },
  "archived": false,
  "properties": { ... },
  "url": "https://www.notion.so/..."
}
```

### `update-page`

Update page properties.

**Parameters:**

- `page_id`: The ID of the page to update
- `properties`: The properties to update
- `archived` (optional): Set to true to archive the page
- `icon` (optional): Update page icon
- `cover` (optional): Update page cover image

**Example Request:**

```json
{
  "page_id": "page_id",
  "properties": {
    "Status": {
      "select": {
        "name": "Done"
      }
    }
  }
}
```

**Example Response:**

```json
{
  "object": "page",
  "id": "page_id",
  "created_time": "2023-01-01T00:00:00.000Z",
  "last_edited_time": "2023-01-03T00:00:00.000Z",
  "parent": { "type": "database_id", "database_id": "database_id" },
  "archived": false,
  "properties": { ... },
  "url": "https://www.notion.so/..."
}
```

## Block Tools

### `append-blocks`

Add content blocks to a page or block.

**Parameters:**

- `block_id`: The ID of the parent block or page
- `children`: Array of block objects to append

**Example Request:**

```json
{
  "block_id": "page_id",
  "children": [
    {
      "object": "block",
      "type": "heading_2",
      "heading_2": {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "New Section"
            }
          }
        ]
      }
    },
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "This is a new paragraph."
            }
          }
        ]
      }
    }
  ]
}
```

**Example Response:**

```json
{
  "object": "list",
  "results": [
    {
      "object": "block",
      "id": "block_id",
      "parent": { "type": "page_id", "page_id": "page_id" },
      "created_time": "2023-01-01T00:00:00.000Z",
      "last_edited_time": "2023-01-01T00:00:00.000Z",
      "has_children": false,
      "type": "heading_2",
      "heading_2": { ... }
    },
    {
      "object": "block",
      "id": "block_id",
      "parent": { "type": "page_id", "page_id": "page_id" },
      "created_time": "2023-01-01T00:00:00.000Z",
      "last_edited_time": "2023-01-01T00:00:00.000Z",
      "has_children": false,
      "type": "paragraph",
      "paragraph": { ... }
    }
  ]
}
```

### `get-block`

Retrieve a block by ID.

**Parameters:**

- `block_id`: The ID of the block to retrieve

**Example Request:**

```json
{
  "block_id": "block_id"
}
```

**Example Response:**

```json
{
  "object": "block",
  "id": "block_id",
  "parent": { "type": "page_id", "page_id": "page_id" },
  "created_time": "2023-01-01T00:00:00.000Z",
  "last_edited_time": "2023-01-01T00:00:00.000Z",
  "has_children": false,
  "type": "paragraph",
  "paragraph": { ... }
}
```

### `get-block-children`

Retrieve the children of a block.

**Parameters:**

- `block_id`: The ID of the parent block
- `start_cursor` (optional): Pagination cursor
- `page_size` (optional): Number of results to return (max 100)

**Example Request:**

```json
{
  "block_id": "block_id",
  "page_size": 10
}
```

**Example Response:**

```json
{
  "object": "list",
  "results": [
    {
      "object": "block",
      "id": "block_id",
      "parent": { "type": "block_id", "block_id": "parent_block_id" },
      "created_time": "2023-01-01T00:00:00.000Z",
      "last_edited_time": "2023-01-01T00:00:00.000Z",
      "has_children": false,
      "type": "paragraph",
      "paragraph": { ... }
    }
  ],
  "next_cursor": null,
  "has_more": false
}
```

### `update-block`

Update a block.

**Parameters:**

- `block_id`: The ID of the block to update
- `type`: The block type
- `[type]`: The block content (depends on the block type)
- `archived` (optional): Set to true to archive the block

**Example Request:**

```json
{
  "block_id": "block_id",
  "type": "paragraph",
  "paragraph": {
    "rich_text": [
      {
        "type": "text",
        "text": {
          "content": "Updated paragraph text."
        }
      }
    ]
  }
}
```

**Example Response:**

```json
{
  "object": "block",
  "id": "block_id",
  "parent": { "type": "page_id", "page_id": "page_id" },
  "created_time": "2023-01-01T00:00:00.000Z",
  "last_edited_time": "2023-01-03T00:00:00.000Z",
  "has_children": false,
  "type": "paragraph",
  "paragraph": { ... }
}
```

### `delete-block`

Delete a block (set archived to true).

**Parameters:**

- `block_id`: The ID of the block to delete

**Example Request:**

```json
{
  "block_id": "block_id"
}
```

**Example Response:**

```json
{
  "object": "block",
  "id": "block_id",
  "parent": { "type": "page_id", "page_id": "page_id" },
  "created_time": "2023-01-01T00:00:00.000Z",
  "last_edited_time": "2023-01-03T00:00:00.000Z",
  "has_children": false,
  "archived": true,
  "type": "paragraph",
  "paragraph": { ... }
}
```

## User Tools

### `list-users`

List all users in the workspace.

**Parameters:**

None

**Example Request:**

```json
{}
```

**Example Response:**

```json
{
  "object": "list",
  "results": [
    {
      "object": "user",
      "id": "user_id",
      "name": "John Doe",
      "avatar_url": "https://secure.notion-static.com/...",
      "type": "person",
      "person": {
        "email": "john@example.com"
      }
    },
    {
      "object": "user",
      "id": "bot_id",
      "name": "My Integration",
      "avatar_url": null,
      "type": "bot",
      "bot": {}
    }
  ]
}
```

### `get-user`

Retrieve a user by ID.

**Parameters:**

- `user_id`: The ID of the user to retrieve

**Example Request:**

```json
{
  "user_id": "user_id"
}
```

**Example Response:**

```json
{
  "object": "user",
  "id": "user_id",
  "name": "John Doe",
  "avatar_url": "https://secure.notion-static.com/...",
  "type": "person",
  "person": {
    "email": "john@example.com"
  }
}
```

### `get-me`

Retrieve the bot user associated with the current API token.

**Parameters:**

None

**Example Request:**

```json
{}
```

**Example Response:**

```json
{
  "object": "user",
  "id": "bot_id",
  "name": "My Integration",
  "avatar_url": null,
  "type": "bot",
  "bot": {}
}
```

## Comment Tools

### `create-comment`

Create a comment on a page.

**Parameters:**

- `page_id`: The ID of the page to comment on
- `text`: The comment text content
- `discussion_id` (optional): Optional discussion ID for threaded comments

**Example Request:**

```json
{
  "page_id": "page_id",
  "text": "This is a comment on the page."
}
```

**Example Response:**

```json
{
  "object": "comment",
  "id": "comment_id",
  "parent": {
    "type": "page_id",
    "page_id": "page_id"
  },
  "discussion_id": "discussion_id",
  "created_time": "2023-01-01T00:00:00.000Z",
  "last_edited_time": "2023-01-01T00:00:00.000Z",
  "created_by": {
    "object": "user",
    "id": "user_id"
  },
  "rich_text": [
    {
      "type": "text",
      "text": {
        "content": "This is a comment on the page."
      },
      "annotations": {
        "bold": false,
        "italic": false,
        "strikethrough": false,
        "underline": false,
        "code": false,
        "color": "default"
      },
      "plain_text": "This is a comment on the page."
    }
  ]
}
```

### `list-comments`

List comments on a page or block.

**Parameters:**

- `page_id` (optional): The ID of the page to get comments from
- `block_id` (optional): The ID of the block to get comments from
- `start_cursor` (optional): Pagination cursor
- `page_size` (optional): Number of results to return (max 100)

**Example Request:**

```json
{
  "page_id": "page_id",
  "page_size": 10
}
```

**Example Response:**

```json
{
  "object": "list",
  "results": [
    {
      "object": "comment",
      "id": "comment_id",
      "parent": {
        "type": "page_id",
        "page_id": "page_id"
      },
      "discussion_id": "discussion_id",
      "created_time": "2023-01-01T00:00:00.000Z",
      "last_edited_time": "2023-01-01T00:00:00.000Z",
      "created_by": {
        "object": "user",
        "id": "user_id"
      },
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "This is a comment on the page."
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "This is a comment on the page."
        }
      ]
    }
  ],
  "next_cursor": null,
  "has_more": false
}
```

## Link Preview Tools

### `create-link-preview`

Create a link preview for a URL.

**Parameters:**

- `url`: The URL to create a preview for
- `page_id` (optional): The ID of the page to add the preview to

**Example Request:**

```json
{
  "url": "https://example.com/article",
  "page_id": "page_id"
}
```

**Example Response:**

```json
{
  "object": "link_preview",
  "id": "link_preview_id",
  "url": "https://example.com/article",
  "title": "Example Article",
  "description": "This is an example article",
  "icon": {
    "type": "emoji",
    "emoji": "📝"
  },
  "cover": {
    "type": "external",
    "external": {
      "url": "https://example.com/image.jpg"
    }
  }
}
```

**Note:** The Link Preview API is a newer feature in the Notion API and may not be fully supported in all environments.

## Error Handling

All tools follow a consistent error handling pattern. When an error occurs, the response will include an `isError` flag set to `true` and an error message in the content.

**Example Error Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Failed to retrieve Notion page - Object not found"
    }
  ],
  "isError": true
}
```

## Working with Notion API Objects

Notion API objects can be complex and have many nested properties. For detailed information about the structure of these objects, refer to the [Notion API documentation](https://developers.notion.com/reference/intro).
