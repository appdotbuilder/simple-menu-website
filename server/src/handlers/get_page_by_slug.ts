
import { db } from '../db';
import { menuItemsTable, pageContentsTable } from '../db/schema';
import { type GetPageBySlugInput, type PageData } from '../schema';
import { eq, and } from 'drizzle-orm';

export const getPageBySlug = async (input: GetPageBySlugInput): Promise<PageData | null> => {
  try {
    // Join menu_items and page_contents tables to get complete page data
    const results = await db.select()
      .from(menuItemsTable)
      .innerJoin(pageContentsTable, eq(menuItemsTable.id, pageContentsTable.menu_item_id))
      .where(
        and(
          eq(menuItemsTable.slug, input.slug),
          eq(menuItemsTable.is_active, true)
        )
      )
      .execute();

    if (results.length === 0) {
      return null;
    }

    // Extract data from joined result
    const result = results[0];
    const menuItem = result.menu_items;
    const pageContent = result.page_contents;

    return {
      id: pageContent.id,
      menu_item_id: menuItem.id,
      name: menuItem.name,
      slug: menuItem.slug,
      title: pageContent.title,
      content: pageContent.content,
      meta_description: pageContent.meta_description,
      meta_keywords: pageContent.meta_keywords,
      is_active: menuItem.is_active,
      order: menuItem.order
    };
  } catch (error) {
    console.error('Get page by slug failed:', error);
    throw error;
  }
};
