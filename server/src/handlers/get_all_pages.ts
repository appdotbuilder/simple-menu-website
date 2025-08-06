
import { db } from '../db';
import { menuItemsTable, pageContentsTable } from '../db/schema';
import { type PageData } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getAllPages = async (): Promise<PageData[]> => {
  try {
    // Join menu items with their page content, filter for active items only
    const results = await db.select()
      .from(menuItemsTable)
      .innerJoin(pageContentsTable, eq(menuItemsTable.id, pageContentsTable.menu_item_id))
      .where(eq(menuItemsTable.is_active, true))
      .orderBy(asc(menuItemsTable.order))
      .execute();

    // Transform joined results to PageData format
    return results.map(result => ({
      id: result.page_contents.id,
      menu_item_id: result.menu_items.id,
      name: result.menu_items.name,
      slug: result.menu_items.slug,
      title: result.page_contents.title,
      content: result.page_contents.content,
      meta_description: result.page_contents.meta_description,
      meta_keywords: result.page_contents.meta_keywords,
      is_active: result.menu_items.is_active,
      order: result.menu_items.order
    }));
  } catch (error) {
    console.error('Failed to get all pages:', error);
    throw error;
  }
};
