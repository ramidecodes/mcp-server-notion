# Tool Documentation

This document provides detailed documentation for each tool available in the Notion MCP Server.

## Search Tools

### `search`

Search for pages or databases in a Notion workspace.

**Parameters:**

| Parameter            | Type   | Required | Description                                 |
| -------------------- | ------ | -------- | ------------------------------------------- |
| `query`              | string | No       | The search query string                     |
| `filter_object_type` | string | No       | Filter by object type: "page" or "database" |
| `page_size`          | number | No       | Number of results to return (max 100)       |

**Example Request:**

```json
{
  "name": "search",
  "params": {
    "query": "project planning",
    "filter_object_type": "page",
    "page_size": 10
  }
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"results\":[{\"object\":\"page\",\"id\":\"abc123\",\"created_time\":\"2023-01-01T00:00:00.000Z\",\"last_edited_time\":\"2023-01-02T00:00:00.000Z\",\"parent\":{\"type\":\"workspace\",\"workspace\":true},\"archived\":false,\"properties\":{\"title\":{\"id\":\"title\",\"type\":\"title\",\"title\":[{\"type\":\"text\",\"text\":{\"content\":\"Project Planning\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"Project Planning\",\"href\":null}]}}}],\"next_cursor\":null,\"has_more\":false}"
    }
  ]
}
```

## Database Tools

### `query-database`

Query a Notion database with optional filters and sorting.

**Parameters:**

| Parameter      | Type   | Required | Description                           |
| -------------- | ------ | -------- | ------------------------------------- |
| `database_id`  | string | Yes      | The ID of the database to query       |
| `filter`       | string | No       | JSON string of filter criteria        |
| `sorts`        | string | No       | JSON string of sort criteria          |
| `page_size`    | number | No       | Number of results to return (max 100) |
| `start_cursor` | string | No       | Pagination cursor                     |

**Example Request:**

```json
{
  "name": "query-database",
  "params": {
    "database_id": "abc123def456",
    "filter": "{\"property\":\"Status\",\"select\":{\"equals\":\"In Progress\"}}",
    "sorts": "[{\"property\":\"Priority\",\"direction\":\"descending\"}]",
    "page_size": 10
  }
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"results\":[{\"object\":\"page\",\"id\":\"page123\",\"created_time\":\"2023-01-01T00:00:00.000Z\",\"last_edited_time\":\"2023-01-02T00:00:00.000Z\",\"parent\":{\"type\":\"database_id\",\"database_id\":\"abc123def456\"},\"archived\":false,\"properties\":{\"Name\":{\"id\":\"title\",\"type\":\"title\",\"title\":[{\"type\":\"text\",\"text\":{\"content\":\"Task 1\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"Task 1\",\"href\":null}]},\"Status\":{\"id\":\"status\",\"type\":\"select\",\"select\":{\"id\":\"1\",\"name\":\"In Progress\",\"color\":\"blue\"}},\"Priority\":{\"id\":\"priority\",\"type\":\"select\",\"select\":{\"id\":\"1\",\"name\":\"High\",\"color\":\"red\"}}}}],\"next_cursor\":null,\"has_more\":false}"
    }
  ]
}
```

### `get-database`

Retrieve a Notion database by ID.

**Parameters:**

| Parameter     | Type   | Required | Description                        |
| ------------- | ------ | -------- | ---------------------------------- |
| `database_id` | string | Yes      | The ID of the database to retrieve |

**Example Request:**

```json
{
  "name": "get-database",
  "params": {
    "database_id": "abc123def456"
  }
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"object\":\"database\",\"id\":\"abc123def456\",\"created_time\":\"2023-01-01T00:00:00.000Z\",\"last_edited_time\":\"2023-01-02T00:00:00.000Z\",\"title\":[{\"type\":\"text\",\"text\":{\"content\":\"Project Tasks\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"Project Tasks\",\"href\":null}],\"properties\":{\"Name\":{\"id\":\"title\",\"name\":\"Name\",\"type\":\"title\"},\"Status\":{\"id\":\"status\",\"name\":\"Status\",\"type\":\"select\",\"select\":{\"options\":[{\"id\":\"1\",\"name\":\"Not Started\",\"color\":\"gray\"},{\"id\":\"2\",\"name\":\"In Progress\",\"color\":\"blue\"},{\"id\":\"3\",\"name\":\"Completed\",\"color\":\"green\"}]}},\"Priority\":{\"id\":\"priority\",\"name\":\"Priority\",\"type\":\"select\",\"select\":{\"options\":[{\"id\":\"1\",\"name\":\"Low\",\"color\":\"gray\"},{\"id\":\"2\",\"name\":\"Medium\",\"color\":\"yellow\"},{\"id\":\"3\",\"name\":\"High\",\"color\":\"red\"}]}}}}"
    }
  ]
}
```

## Page Tools

### `create-page`

Create a new page in Notion.

**Parameters:**

| Parameter     | Type   | Required | Description                                |
| ------------- | ------ | -------- | ------------------------------------------ |
| `parent_type` | string | Yes      | Type of parent: "database_id" or "page_id" |
| `parent_id`   | string | Yes      | ID of the parent database or page          |
| `properties`  | string | Yes      | JSON string of page properties             |
| `children`    | string | No       | JSON string of page content blocks         |

**Example Request (Creating a page in a database):**

```json
{
  "name": "create-page",
  "params": {
    "parent_type": "database_id",
    "parent_id": "abc123def456",
    "properties": "{\"Name\":{\"title\":[{\"text\":{\"content\":\"New Task\"}}]},\"Status\":{\"select\":{\"name\":\"Not Started\"}},\"Priority\":{\"select\":{\"name\":\"Medium\"}}}",
    "children": "[{\"object\":\"block\",\"type\":\"paragraph\",\"paragraph\":{\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"This is a new task.\"}}]}}]"
  }
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"object\":\"page\",\"id\":\"page123\",\"created_time\":\"2023-01-01T00:00:00.000Z\",\"last_edited_time\":\"2023-01-01T00:00:00.000Z\",\"parent\":{\"type\":\"database_id\",\"database_id\":\"abc123def456\"},\"archived\":false,\"properties\":{\"Name\":{\"id\":\"title\",\"type\":\"title\",\"title\":[{\"type\":\"text\",\"text\":{\"content\":\"New Task\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"New Task\",\"href\":null}]},\"Status\":{\"id\":\"status\",\"type\":\"select\",\"select\":{\"id\":\"1\",\"name\":\"Not Started\",\"color\":\"gray\"}},\"Priority\":{\"id\":\"priority\",\"type\":\"select\",\"select\":{\"id\":\"2\",\"name\":\"Medium\",\"color\":\"yellow\"}}}}"
    }
  ]
}
```

### `get-page`

Retrieve a Notion page by ID.

**Parameters:**

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `page_id` | string | Yes      | The ID of the page to retrieve |

**Example Request:**

```json
{
  "name": "get-page",
  "params": {
    "page_id": "page123"
  }
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"object\":\"page\",\"id\":\"page123\",\"created_time\":\"2023-01-01T00:00:00.000Z\",\"last_edited_time\":\"2023-01-02T00:00:00.000Z\",\"parent\":{\"type\":\"database_id\",\"database_id\":\"abc123def456\"},\"archived\":false,\"properties\":{\"Name\":{\"id\":\"title\",\"type\":\"title\",\"title\":[{\"type\":\"text\",\"text\":{\"content\":\"Task 1\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"Task 1\",\"href\":null}]},\"Status\":{\"id\":\"status\",\"type\":\"select\",\"select\":{\"id\":\"1\",\"name\":\"In Progress\",\"color\":\"blue\"}},\"Priority\":{\"id\":\"priority\",\"type\":\"select\",\"select\":{\"id\":\"1\",\"name\":\"High\",\"color\":\"red\"}}}}"
    }
  ]
}
```

### `update-page`

Update a Notion page.

**Parameters:**

| Parameter    | Type    | Required | Description                              |
| ------------ | ------- | -------- | ---------------------------------------- |
| `page_id`    | string  | Yes      | The ID of the page to update             |
| `properties` | string  | Yes      | JSON string of page properties to update |
| `archived`   | boolean | No       | Whether to archive the page              |

**Example Request:**

```json
{
  "name": "update-page",
  "params": {
    "page_id": "page123",
    "properties": "{\"Status\":{\"select\":{\"name\":\"Completed\"}}}",
    "archived": false
  }
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"object\":\"page\",\"id\":\"page123\",\"created_time\":\"2023-01-01T00:00:00.000Z\",\"last_edited_time\":\"2023-01-03T00:00:00.000Z\",\"parent\":{\"type\":\"database_id\",\"database_id\":\"abc123def456\"},\"archived\":false,\"properties\":{\"Name\":{\"id\":\"title\",\"type\":\"title\",\"title\":[{\"type\":\"text\",\"text\":{\"content\":\"Task 1\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"Task 1\",\"href\":null}]},\"Status\":{\"id\":\"status\",\"type\":\"select\",\"select\":{\"id\":\"3\",\"name\":\"Completed\",\"color\":\"green\"}},\"Priority\":{\"id\":\"priority\",\"type\":\"select\",\"select\":{\"id\":\"1\",\"name\":\"High\",\"color\":\"red\"}}}}"
    }
  ]
}
```

## Block Tools

### `append-blocks`

Add content blocks to a page or block.

**Parameters:**

| Parameter  | Type   | Required | Description                      |
| ---------- | ------ | -------- | -------------------------------- |
| `block_id` | string | Yes      | The ID of the block to append to |
| `children` | string | Yes      | JSON string of blocks to append  |

**Example Request:**

```json
{
  "name": "append-blocks",
  "params": {
    "block_id": "page123",
    "children": "[{\"object\":\"block\",\"type\":\"heading_2\",\"heading_2\":{\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"Notes\"}}]}},{\"object\":\"block\",\"type\":\"paragraph\",\"paragraph\":{\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"This is an important task.\"}}]}}]"
  }
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"object\":\"list\",\"results\":[{\"object\":\"block\",\"id\":\"block1\",\"parent\":{\"type\":\"page_id\",\"page_id\":\"page123\"},\"created_time\":\"2023-01-03T00:00:00.000Z\",\"last_edited_time\":\"2023-01-03T00:00:00.000Z\",\"created_by\":{\"object\":\"user\",\"id\":\"user1\"},\"last_edited_by\":{\"object\":\"user\",\"id\":\"user1\"},\"has_children\":false,\"archived\":false,\"type\":\"heading_2\",\"heading_2\":{\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"Notes\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"Notes\",\"href\":null}],\"color\":\"default\"}},{\"object\":\"block\",\"id\":\"block2\",\"parent\":{\"type\":\"page_id\",\"page_id\":\"page123\"},\"created_time\":\"2023-01-03T00:00:00.000Z\",\"last_edited_time\":\"2023-01-03T00:00:00.000Z\",\"created_by\":{\"object\":\"user\",\"id\":\"user1\"},\"last_edited_by\":{\"object\":\"user\",\"id\":\"user1\"},\"has_children\":false,\"archived\":false,\"type\":\"paragraph\",\"paragraph\":{\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"This is an important task.\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"This is an important task.\",\"href\":null}],\"color\":\"default\"}}],\"next_cursor\":null,\"has_more\":false}"
    }
  ]
}
```

### `get-block`

Retrieve a block by ID.

**Parameters:**

| Parameter  | Type   | Required | Description                     |
| ---------- | ------ | -------- | ------------------------------- |
| `block_id` | string | Yes      | The ID of the block to retrieve |

**Example Request:**

```json
{
  "name": "get-block",
  "params": {
    "block_id": "block1"
  }
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"object\":\"block\",\"id\":\"block1\",\"parent\":{\"type\":\"page_id\",\"page_id\":\"page123\"},\"created_time\":\"2023-01-03T00:00:00.000Z\",\"last_edited_time\":\"2023-01-03T00:00:00.000Z\",\"created_by\":{\"object\":\"user\",\"id\":\"user1\"},\"last_edited_by\":{\"object\":\"user\",\"id\":\"user1\"},\"has_children\":false,\"archived\":false,\"type\":\"heading_2\",\"heading_2\":{\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"Notes\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"Notes\",\"href\":null}],\"color\":\"default\"}}"
    }
  ]
}
```

### `get-block-children`

Retrieve children blocks of a block or page.

**Parameters:**

| Parameter      | Type   | Required | Description                              |
| -------------- | ------ | -------- | ---------------------------------------- |
| `block_id`     | string | Yes      | The ID of the block to get children from |
| `page_size`    | number | No       | Number of results to return (max 100)    |
| `start_cursor` | string | No       | Pagination cursor                        |

**Example Request:**

```json
{
  "name": "get-block-children",
  "params": {
    "block_id": "page123",
    "page_size": 10
  }
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"object\":\"list\",\"results\":[{\"object\":\"block\",\"id\":\"block1\",\"parent\":{\"type\":\"page_id\",\"page_id\":\"page123\"},\"created_time\":\"2023-01-03T00:00:00.000Z\",\"last_edited_time\":\"2023-01-03T00:00:00.000Z\",\"created_by\":{\"object\":\"user\",\"id\":\"user1\"},\"last_edited_by\":{\"object\":\"user\",\"id\":\"user1\"},\"has_children\":false,\"archived\":false,\"type\":\"heading_2\",\"heading_2\":{\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"Notes\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"Notes\",\"href\":null}],\"color\":\"default\"}},{\"object\":\"block\",\"id\":\"block2\",\"parent\":{\"type\":\"page_id\",\"page_id\":\"page123\"},\"created_time\":\"2023-01-03T00:00:00.000Z\",\"last_edited_time\":\"2023-01-03T00:00:00.000Z\",\"created_by\":{\"object\":\"user\",\"id\":\"user1\"},\"last_edited_by\":{\"object\":\"user\",\"id\":\"user1\"},\"has_children\":false,\"archived\":false,\"type\":\"paragraph\",\"paragraph\":{\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"This is an important task.\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"This is an important task.\",\"href\":null}],\"color\":\"default\"}}],\"next_cursor\":null,\"has_more\":false}"
    }
  ]
}
```

### `update-block`

Update a block.

**Parameters:**

| Parameter    | Type   | Required | Description                               |
| ------------ | ------ | -------- | ----------------------------------------- |
| `block_id`   | string | Yes      | The ID of the block to update             |
| `properties` | string | Yes      | JSON string of block properties to update |

**Example Request:**

```json
{
  "name": "update-block",
  "params": {
    "block_id": "block2",
    "properties": "{\"paragraph\":{\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"This is a very important task.\"}}]}}"
  }
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"object\":\"block\",\"id\":\"block2\",\"parent\":{\"type\":\"page_id\",\"page_id\":\"page123\"},\"created_time\":\"2023-01-03T00:00:00.000Z\",\"last_edited_time\":\"2023-01-04T00:00:00.000Z\",\"created_by\":{\"object\":\"user\",\"id\":\"user1\"},\"last_edited_by\":{\"object\":\"user\",\"id\":\"user1\"},\"has_children\":false,\"archived\":false,\"type\":\"paragraph\",\"paragraph\":{\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"This is a very important task.\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"This is a very important task.\",\"href\":null}],\"color\":\"default\"}}"
    }
  ]
}
```

### `delete-block`

Delete (archive) a block.

**Parameters:**

| Parameter  | Type   | Required | Description                   |
| ---------- | ------ | -------- | ----------------------------- |
| `block_id` | string | Yes      | The ID of the block to delete |

**Example Request:**

```json
{
  "name": "delete-block",
  "params": {
    "block_id": "block2"
  }
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"object\":\"block\",\"id\":\"block2\",\"parent\":{\"type\":\"page_id\",\"page_id\":\"page123\"},\"created_time\":\"2023-01-03T00:00:00.000Z\",\"last_edited_time\":\"2023-01-04T00:00:00.000Z\",\"created_by\":{\"object\":\"user\",\"id\":\"user1\"},\"last_edited_by\":{\"object\":\"user\",\"id\":\"user1\"},\"has_children\":false,\"archived\":true,\"type\":\"paragraph\",\"paragraph\":{\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"This is a very important task.\"},\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"This is a very important task.\",\"href\":null}],\"color\":\"default\"}}"
    }
  ]
}
```

## Error Handling

All tools follow the same error handling pattern. If an error occurs, the response will include an `isError` flag set to `true` and an error message in the content:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Failed to search Notion - Invalid request"
    }
  ],
  "isError": true
}
```

## Working with Notion API Objects

The Notion API returns complex objects with nested properties. When working with these objects, it's important to understand the structure of the data.

For more information on the Notion API object structure, see the [Notion API Reference](https://developers.notion.com/reference).
