
import { serial, text, pgTable, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const menuItemsTable = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  order: integer('order').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const pageContentsTable = pgTable('page_contents', {
  id: serial('id').primaryKey(),
  menu_item_id: integer('menu_item_id').notNull().references(() => menuItemsTable.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  meta_description: text('meta_description'),
  meta_keywords: text('meta_keywords'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const menuItemsRelations = relations(menuItemsTable, ({ one }) => ({
  pageContent: one(pageContentsTable, {
    fields: [menuItemsTable.id],
    references: [pageContentsTable.menu_item_id],
  }),
}));

export const pageContentsRelations = relations(pageContentsTable, ({ one }) => ({
  menuItem: one(menuItemsTable, {
    fields: [pageContentsTable.menu_item_id],
    references: [menuItemsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type MenuItem = typeof menuItemsTable.$inferSelect;
export type NewMenuItem = typeof menuItemsTable.$inferInsert;
export type PageContent = typeof pageContentsTable.$inferSelect;
export type NewPageContent = typeof pageContentsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = { 
  menuItems: menuItemsTable, 
  pageContents: pageContentsTable 
};

export const tableRelations = {
  menuItemsRelations,
  pageContentsRelations
};
