import {
  Client,
  APIErrorCode,
  ClientErrorCode,
  APIResponseError,
  isNotionClientError,
} from "@notionhq/client";
import dotenv from "dotenv";
import {
  SearchQuery,
  DatabaseQuery,
  CreatePage,
  BlockChildren,
  UpdatePage,
  BlockChildrenQuery,
  CommentQuery,
  CreateComment,
  LinkPreview,
} from "../types/notion.js";

// Load environment variables
dotenv.config();

/**
 * Error class for Notion API errors
 */
export class NotionAPIError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = "NotionAPIError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Notion service for interacting with the Notion API
 */
export class NotionService {
  private client: Client;

  constructor(apiKey?: string) {
    if (!apiKey && !process.env.NOTION_API_KEY) {
      throw new Error(
        "Notion API key is required. Provide it as a parameter or set the NOTION_API_KEY environment variable."
      );
    }

    this.client = new Client({
      auth: apiKey || process.env.NOTION_API_KEY,
    });
  }

  /**
   * Handle Notion API errors
   */
  private handleError(error: unknown): never {
    if (error instanceof APIResponseError) {
      throw new NotionAPIError(error.message, error.code, error.status);
    } else if (isNotionClientError(error)) {
      throw new NotionAPIError(error.message, error.code);
    } else {
      throw error;
    }
  }

  /**
   * Search for pages or databases in Notion
   */
  async search(params: SearchQuery) {
    try {
      return await this.client.search(params);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Query a database
   */
  async queryDatabase(params: DatabaseQuery) {
    try {
      const queryParams: Parameters<typeof this.client.databases.query>[0] = {
        database_id: params.database_id,
        page_size: params.page_size,
        start_cursor: params.start_cursor,
      };

      // Only add filter and sorts if they exist to avoid type issues
      if (params.filter) {
        queryParams.filter = params.filter as any;
      }

      if (params.sorts) {
        queryParams.sorts = params.sorts.map((sort) => {
          if (sort.property) {
            return {
              property: sort.property,
              direction: sort.direction,
            };
          } else if (sort.timestamp) {
            return {
              timestamp: sort.timestamp,
              direction: sort.direction,
            };
          }
          // Default to a property sort if neither is specified
          return {
            property: "title",
            direction: sort.direction,
          };
        });
      }

      return await this.client.databases.query(queryParams);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieve a database
   */
  async retrieveDatabase(databaseId: string) {
    try {
      return await this.client.databases.retrieve({
        database_id: databaseId,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create a database
   */
  async createDatabase(params: any) {
    try {
      return await this.client.databases.create(params);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update a database
   */
  async updateDatabase(databaseId: string, params: any) {
    try {
      return await this.client.databases.update({
        database_id: databaseId,
        ...params,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create a new page
   */
  async createPage(params: CreatePage) {
    try {
      return await this.client.pages.create({
        parent:
          params.parent.type === "database_id"
            ? { database_id: params.parent.database_id! }
            : { page_id: params.parent.page_id! },
        properties: params.properties,
        children: params.children,
        icon: params.icon,
        cover: params.cover,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieve a page
   */
  async retrievePage(pageId: string) {
    try {
      return await this.client.pages.retrieve({
        page_id: pageId,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieve a page property
   */
  async retrievePageProperty(pageId: string, propertyId: string) {
    try {
      return await this.client.pages.properties.retrieve({
        page_id: pageId,
        property_id: propertyId,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update a page
   */
  async updatePage(params: UpdatePage) {
    try {
      return await this.client.pages.update({
        page_id: params.page_id,
        properties: params.properties,
        archived: params.archived,
        icon: params.icon,
        cover: params.cover,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Add blocks to a page
   */
  async appendBlockChildren(params: BlockChildren) {
    try {
      return await this.client.blocks.children.append({
        block_id: params.block_id,
        children: params.children,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieve a block
   */
  async retrieveBlock(blockId: string) {
    try {
      return await this.client.blocks.retrieve({
        block_id: blockId,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieve block children
   */
  async retrieveBlockChildren(params: BlockChildrenQuery) {
    try {
      return await this.client.blocks.children.list({
        block_id: params.block_id,
        start_cursor: params.start_cursor,
        page_size: params.page_size,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update a block
   */
  async updateBlock(blockId: string, properties: Record<string, any>) {
    try {
      return await this.client.blocks.update({
        block_id: blockId,
        ...properties,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete a block (set archived to true)
   */
  async deleteBlock(blockId: string) {
    try {
      return await this.client.blocks.delete({
        block_id: blockId,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * List all users
   */
  async listUsers() {
    try {
      return await this.client.users.list({});
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieve a user
   */
  async retrieveUser(userId: string) {
    try {
      return await this.client.users.retrieve({
        user_id: userId,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieve the bot user
   */
  async retrieveMe() {
    try {
      return await this.client.users.me({});
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create a comment
   */
  async createComment(params: CreateComment) {
    try {
      return await this.client.comments.create(params);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * List comments
   */
  async listComments(params: CommentQuery) {
    try {
      if (!params.page_id && !params.block_id) {
        throw new NotionAPIError(
          "Either page_id or block_id must be provided",
          "INVALID_REQUEST_PARAMETERS"
        );
      }

      // According to the Notion API docs, we should use block_id for both pages and blocks
      // Pages are technically blocks in Notion's data model
      const blockId = params.block_id || params.page_id;

      return await this.client.comments.list({
        block_id: blockId!, // Non-null assertion since we've checked above
        start_cursor: params.start_cursor,
        page_size: params.page_size,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create a link preview (unfurl)
   */
  async createLinkPreview(params: LinkPreview) {
    try {
      // The Notion API doesn't have a direct method for link previews yet
      // This is a placeholder for when the feature becomes available in the SDK
      throw new NotionAPIError(
        "Link Preview API is not yet available in the official Notion SDK",
        "NOT_IMPLEMENTED"
      );
    } catch (error) {
      this.handleError(error);
    }
  }
}
