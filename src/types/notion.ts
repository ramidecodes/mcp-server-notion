import { z } from "zod";

// Search query parameters
export const SearchQuerySchema = z.object({
  query: z.string().optional(),
  filter: z
    .object({
      value: z.enum(["page", "database"]),
      property: z.literal("object"),
    })
    .optional(),
  sort: z
    .object({
      direction: z.enum(["ascending", "descending"]),
      timestamp: z.enum(["last_edited_time"]),
    })
    .optional(),
  page_size: z.number().min(1).max(100).optional(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

// Database query parameters
export const DatabaseQuerySchema = z.object({
  database_id: z.string(),
  filter: z.record(z.any()).optional(),
  sorts: z
    .array(
      z.object({
        property: z.string().optional(),
        timestamp: z.enum(["created_time", "last_edited_time"]).optional(),
        direction: z.enum(["ascending", "descending"]),
      })
    )
    .optional(),
  page_size: z.number().min(1).max(100).optional(),
  start_cursor: z.string().optional(),
});

export type DatabaseQuery = z.infer<typeof DatabaseQuerySchema>;

// Page creation parameters
export const CreatePageSchema = z.object({
  parent: z.object({
    database_id: z.string().optional(),
    page_id: z.string().optional(),
    type: z.enum(["database_id", "page_id"]),
  }),
  properties: z.record(z.any()),
  children: z.array(z.any()).optional(),
  icon: z.any().optional(),
  cover: z.any().optional(),
});

export type CreatePage = z.infer<typeof CreatePageSchema>;

// Block creation parameters
export const BlockChildrenSchema = z.object({
  block_id: z.string(),
  children: z.array(z.any()),
});

export type BlockChildren = z.infer<typeof BlockChildrenSchema>;

// Update page parameters
export const UpdatePageSchema = z.object({
  page_id: z.string(),
  properties: z.record(z.any()),
  archived: z.boolean().optional(),
  icon: z.any().optional(),
  cover: z.any().optional(),
});

export type UpdatePage = z.infer<typeof UpdatePageSchema>;

// Retrieve block children parameters
export const BlockChildrenQuerySchema = z.object({
  block_id: z.string(),
  start_cursor: z.string().optional(),
  page_size: z.number().min(1).max(100).optional(),
});

export type BlockChildrenQuery = z.infer<typeof BlockChildrenQuerySchema>;

// Comment query parameters
export const CommentQuerySchema = z.object({
  block_id: z.string().optional(),
  page_id: z.string().optional(),
  start_cursor: z.string().optional(),
  page_size: z.number().min(1).max(100).optional(),
});

export type CommentQuery = z.infer<typeof CommentQuerySchema>;

// Create comment parameters
export const CreateCommentSchema = z.object({
  parent: z.object({
    page_id: z.string(),
  }),
  rich_text: z.array(
    z.object({
      type: z.literal("text"),
      text: z.object({
        content: z.string(),
        link: z
          .object({
            url: z.string(),
          })
          .optional(),
      }),
      annotations: z
        .object({
          bold: z.boolean().optional(),
          italic: z.boolean().optional(),
          strikethrough: z.boolean().optional(),
          underline: z.boolean().optional(),
          code: z.boolean().optional(),
          color: z
            .enum([
              "default",
              "gray",
              "brown",
              "orange",
              "yellow",
              "green",
              "blue",
              "purple",
              "pink",
              "red",
            ])
            .optional(),
        })
        .optional(),
    })
  ),
  discussion_id: z.string().optional(),
});

export type CreateComment = z.infer<typeof CreateCommentSchema>;

// Link Preview parameters
export const LinkPreviewSchema = z.object({
  url: z.string().url(),
  page_id: z.string().optional(),
});

export type LinkPreview = z.infer<typeof LinkPreviewSchema>;
