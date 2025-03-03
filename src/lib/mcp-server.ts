import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NotionService } from "./notion.js";
import { z } from "zod";

/**
 * MCP Server that wraps the Notion SDK
 */
export class NotionMCPServer {
  private server: McpServer;
  private notionService: NotionService;

  constructor(notionApiKey?: string) {
    // Initialize the Notion service
    this.notionService = new NotionService(notionApiKey);

    // Initialize the MCP server
    this.server = new McpServer({
      name: "notion",
      version: "1.0.0",
      description: "MCP server for Notion API",
    });

    // Register all tools
    this.registerTools();
  }

  /**
   * Register all tools for the MCP server
   */
  private registerTools(): void {
    // Search
    this.registerSearchTool();

    // Database operations
    this.registerDatabaseTools();

    // Page operations
    this.registerPageTools();

    // Block operations
    this.registerBlockTools();

    // User operations
    this.registerUserTools();

    // Comment operations
    this.registerCommentTools();

    // Link Preview operations
    this.registerLinkPreviewTools();
  }

  /**
   * Register search-related tools
   */
  private registerSearchTool(): void {
    this.server.tool(
      "search",
      {
        query: z.string().optional().describe("The search query string"),
        filter_object_type: z
          .enum(["page", "database"])
          .optional()
          .describe("Filter by object type"),
        page_size: z
          .number()
          .min(1)
          .max(100)
          .optional()
          .describe("Number of results to return (max 100)"),
      },
      async ({ query, filter_object_type, page_size }) => {
        const params: any = { page_size };
        if (query) params.query = query;
        if (filter_object_type) {
          params.filter = {
            property: "object",
            value: filter_object_type,
          };
        }

        try {
          const results = await this.notionService.search(params);
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
  }

  /**
   * Register database-related tools
   */
  private registerDatabaseTools(): void {
    // Query database
    this.server.tool(
      "query-database",
      {
        database_id: z.string().describe("The ID of the database to query"),
        filter: z
          .string()
          .optional()
          .describe("JSON string of filter criteria"),
        sorts: z.string().optional().describe("JSON string of sort criteria"),
        page_size: z
          .number()
          .min(1)
          .max(100)
          .optional()
          .describe("Number of results to return (max 100)"),
        start_cursor: z.string().optional().describe("Pagination cursor"),
      },
      async ({ database_id, filter, sorts, page_size, start_cursor }) => {
        const params: any = { database_id, page_size, start_cursor };
        if (filter) params.filter = JSON.parse(filter);
        if (sorts) params.sorts = JSON.parse(sorts);

        try {
          const results = await this.notionService.queryDatabase(params);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(results, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in query-database tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to query database - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get database
    this.server.tool(
      "get-database",
      {
        database_id: z.string().describe("The ID of the database to retrieve"),
      },
      async ({ database_id }) => {
        try {
          const database = await this.notionService.retrieveDatabase(
            database_id
          );
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(database, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in get-database tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to retrieve database - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  /**
   * Register page-related tools
   */
  private registerPageTools(): void {
    // Create page
    this.server.tool(
      "create-page",
      {
        parent_type: z
          .enum(["database_id", "page_id"])
          .describe("Type of parent (database or page)"),
        parent_id: z.string().describe("ID of the parent database or page"),
        properties: z.string().describe("JSON string of page properties"),
        children: z
          .string()
          .optional()
          .describe("JSON string of page content blocks"),
      },
      async ({ parent_type, parent_id, properties, children }) => {
        const params: any = {
          parent: {
            type: parent_type,
            [parent_type]: parent_id,
          },
          properties: JSON.parse(properties),
        };

        if (children) {
          params.children = JSON.parse(children);
        }

        try {
          const page = await this.notionService.createPage(params);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(page, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in create-page tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to create page - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get page
    this.server.tool(
      "get-page",
      {
        page_id: z.string().describe("The ID of the page to retrieve"),
      },
      async ({ page_id }) => {
        try {
          const page = await this.notionService.retrievePage(page_id);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(page, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in get-page tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to retrieve page - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Update page
    this.server.tool(
      "update-page",
      {
        page_id: z.string().describe("The ID of the page to update"),
        properties: z
          .string()
          .describe("JSON string of page properties to update"),
        archived: z
          .boolean()
          .optional()
          .describe("Whether to archive the page"),
      },
      async ({ page_id, properties, archived }) => {
        const params: any = {
          page_id,
          properties: JSON.parse(properties),
        };

        if (archived !== undefined) {
          params.archived = archived;
        }

        try {
          const page = await this.notionService.updatePage(params);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(page, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in update-page tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to update page - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  /**
   * Register block-related tools
   */
  private registerBlockTools(): void {
    // Append blocks
    this.server.tool(
      "append-blocks",
      {
        block_id: z.string().describe("The ID of the block to append to"),
        children: z.string().describe("JSON string of blocks to append"),
      },
      async ({ block_id, children }) => {
        try {
          const result = await this.notionService.appendBlockChildren({
            block_id,
            children: JSON.parse(children),
          });
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in append-blocks tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to append blocks - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get block
    this.server.tool(
      "get-block",
      {
        block_id: z.string().describe("The ID of the block to retrieve"),
      },
      async ({ block_id }) => {
        try {
          const block = await this.notionService.retrieveBlock(block_id);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(block, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in get-block tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to retrieve block - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get block children
    this.server.tool(
      "get-block-children",
      {
        block_id: z
          .string()
          .describe("The ID of the block to get children from"),
        page_size: z
          .number()
          .min(1)
          .max(100)
          .optional()
          .describe("Number of results to return (max 100)"),
        start_cursor: z.string().optional().describe("Pagination cursor"),
      },
      async ({ block_id, page_size, start_cursor }) => {
        try {
          const blocks = await this.notionService.retrieveBlockChildren({
            block_id,
            page_size,
            start_cursor,
          });
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(blocks, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in get-block-children tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to retrieve block children - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Update block
    this.server.tool(
      "update-block",
      {
        block_id: z.string().describe("The ID of the block to update"),
        properties: z
          .string()
          .describe("JSON string of block properties to update"),
      },
      async ({ block_id, properties }) => {
        try {
          const block = await this.notionService.updateBlock(
            block_id,
            JSON.parse(properties)
          );
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(block, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in update-block tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to update block - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Delete block
    this.server.tool(
      "delete-block",
      {
        block_id: z.string().describe("The ID of the block to delete"),
      },
      async ({ block_id }) => {
        try {
          const result = await this.notionService.deleteBlock(block_id);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in delete-block tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to delete block - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  /**
   * Register user-related tools
   */
  private registerUserTools(): void {
    // List users
    this.server.tool("list-users", {}, async () => {
      try {
        const results = await this.notionService.listUsers();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error("Error in list-users tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to list Notion users - ${
                (error as Error).message
              }`,
            },
          ],
          isError: true,
        };
      }
    });

    // Get user
    this.server.tool(
      "get-user",
      {
        user_id: z.string().describe("The ID of the user to retrieve"),
      },
      async ({ user_id }) => {
        try {
          const result = await this.notionService.retrieveUser(user_id);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in get-user tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to retrieve Notion user - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get bot user (me)
    this.server.tool("get-me", {}, async () => {
      try {
        const result = await this.notionService.retrieveMe();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error("Error in get-me tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to retrieve bot user - ${
                (error as Error).message
              }`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Register comment-related tools
   */
  private registerCommentTools(): void {
    // Create comment
    this.server.tool(
      "create-comment",
      {
        page_id: z.string().describe("The ID of the page to comment on"),
        text: z.string().describe("The comment text content"),
        discussion_id: z
          .string()
          .optional()
          .describe("Optional discussion ID for threaded comments"),
      },
      async ({ page_id, text, discussion_id }) => {
        try {
          const result = await this.notionService.createComment({
            parent: {
              page_id: page_id,
            },
            rich_text: [
              {
                type: "text",
                text: {
                  content: text,
                },
              },
            ],
            discussion_id,
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in create-comment tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to create comment - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // List comments
    this.server.tool(
      "list-comments",
      {
        page_id: z
          .string()
          .optional()
          .describe("The ID of the page to get comments from"),
        block_id: z
          .string()
          .optional()
          .describe("The ID of the block to get comments from"),
        start_cursor: z.string().optional().describe("Pagination cursor"),
        page_size: z
          .number()
          .min(1)
          .max(100)
          .optional()
          .describe("Number of results to return (max 100)"),
      },
      async ({ page_id, block_id, start_cursor, page_size }) => {
        try {
          if (!page_id && !block_id) {
            return {
              content: [
                {
                  type: "text",
                  text: "Error: Either page_id or block_id must be provided",
                },
              ],
              isError: true,
            };
          }

          const result = await this.notionService.listComments({
            page_id,
            block_id,
            start_cursor,
            page_size,
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in list-comments tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to list comments - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  /**
   * Register Link Preview tools
   */
  private registerLinkPreviewTools(): void {
    // Create link preview
    this.server.tool(
      "create-link-preview",
      {
        url: z.string().url().describe("The URL to create a preview for"),
        page_id: z
          .string()
          .optional()
          .describe("The ID of the page to add the preview to"),
      },
      async ({ url, page_id }) => {
        try {
          const result = await this.notionService.createLinkPreview({
            url,
            page_id,
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error("Error in create-link-preview tool:", error);
          return {
            content: [
              {
                type: "text",
                text: `Error: Failed to create link preview - ${
                  (error as Error).message
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  /**
   * Connect the server to a transport
   */
  async connect(transport: any): Promise<void> {
    await this.server.connect(transport);
  }
}
