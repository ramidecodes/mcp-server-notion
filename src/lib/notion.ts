import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import {
  SearchQuery,
  DatabaseQuery,
  CreatePage,
  BlockChildren,
  UpdatePage,
  BlockChildrenQuery,
} from "../types/notion.js";

// Load environment variables
dotenv.config();

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

/**
 * Notion service for interacting with the Notion API
 */
export class NotionService {
  private client: Client;

  constructor(apiKey?: string) {
    this.client = apiKey ? new Client({ auth: apiKey }) : notion;
  }

  /**
   * Search for pages or databases in Notion
   */
  async search(params: SearchQuery) {
    return await this.client.search(params);
  }

  /**
   * Query a database
   */
  async queryDatabase(params: DatabaseQuery) {
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
  }

  /**
   * Retrieve a database
   */
  async retrieveDatabase(databaseId: string) {
    return await this.client.databases.retrieve({
      database_id: databaseId,
    });
  }

  /**
   * Create a new page
   */
  async createPage(params: CreatePage) {
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
  }

  /**
   * Retrieve a page
   */
  async retrievePage(pageId: string) {
    return await this.client.pages.retrieve({
      page_id: pageId,
    });
  }

  /**
   * Update a page
   */
  async updatePage(params: UpdatePage) {
    return await this.client.pages.update({
      page_id: params.page_id,
      properties: params.properties,
      archived: params.archived,
      icon: params.icon,
      cover: params.cover,
    });
  }

  /**
   * Add blocks to a page
   */
  async appendBlockChildren(params: BlockChildren) {
    return await this.client.blocks.children.append({
      block_id: params.block_id,
      children: params.children,
    });
  }

  /**
   * Retrieve a block
   */
  async retrieveBlock(blockId: string) {
    return await this.client.blocks.retrieve({
      block_id: blockId,
    });
  }

  /**
   * Retrieve block children
   */
  async retrieveBlockChildren(params: BlockChildrenQuery) {
    return await this.client.blocks.children.list({
      block_id: params.block_id,
      start_cursor: params.start_cursor,
      page_size: params.page_size,
    });
  }

  /**
   * Update a block
   */
  async updateBlock(blockId: string, properties: Record<string, any>) {
    return await this.client.blocks.update({
      block_id: blockId,
      ...properties,
    });
  }

  /**
   * Delete a block (set archived to true)
   */
  async deleteBlock(blockId: string) {
    return await this.client.blocks.delete({
      block_id: blockId,
    });
  }
}
