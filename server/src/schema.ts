
import { z } from 'zod';

// Menu item schema
export const menuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  order: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type MenuItem = z.infer<typeof menuItemSchema>;

// Page content schema
export const pageContentSchema = z.object({
  id: z.number(),
  menu_item_id: z.number(),
  title: z.string(),
  content: z.string(),
  meta_description: z.string().nullable(),
  meta_keywords: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type PageContent = z.infer<typeof pageContentSchema>;

// Input schema for creating menu items
export const createMenuItemInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  order: z.number().int().nonnegative(),
  is_active: z.boolean().default(true)
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemInputSchema>;

// Input schema for updating menu items
export const updateMenuItemInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  order: z.number().int().nonnegative().optional(),
  is_active: z.boolean().optional()
});

export type UpdateMenuItemInput = z.infer<typeof updateMenuItemInputSchema>;

// Input schema for creating page content
export const createPageContentInputSchema = z.object({
  menu_item_id: z.number(),
  title: z.string().min(1),
  content: z.string(),
  meta_description: z.string().nullable().optional(),
  meta_keywords: z.string().nullable().optional()
});

export type CreatePageContentInput = z.infer<typeof createPageContentInputSchema>;

// Input schema for updating page content
export const updatePageContentInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  meta_description: z.string().nullable().optional(),
  meta_keywords: z.string().nullable().optional()
});

export type UpdatePageContentInput = z.infer<typeof updatePageContentInputSchema>;

// Schema for getting page by slug
export const getPageBySlugInputSchema = z.object({
  slug: z.string().min(1)
});

export type GetPageBySlugInput = z.infer<typeof getPageBySlugInputSchema>;

// Combined page data schema for frontend
export const pageDataSchema = z.object({
  id: z.number(),
  menu_item_id: z.number(),
  name: z.string(),
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  meta_description: z.string().nullable(),
  meta_keywords: z.string().nullable(),
  is_active: z.boolean(),
  order: z.number().int()
});

export type PageData = z.infer<typeof pageDataSchema>;
