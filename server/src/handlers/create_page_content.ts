
import { db } from '../db';
import { pageContentsTable, menuItemsTable } from '../db/schema';
import { type CreatePageContentInput, type PageContent } from '../schema';
import { eq } from 'drizzle-orm';

export const createPageContent = async (input: CreatePageContentInput): Promise<PageContent> => {
  try {
    // Verify the referenced menu item exists
    const menuItems = await db.select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, input.menu_item_id))
      .execute();

    if (menuItems.length === 0) {
      throw new Error(`Menu item with id ${input.menu_item_id} does not exist`);
    }

    // Insert page content record
    const result = await db.insert(pageContentsTable)
      .values({
        menu_item_id: input.menu_item_id,
        title: input.title,
        content: input.content,
        meta_description: input.meta_description || null,
        meta_keywords: input.meta_keywords || null
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Page content creation failed:', error);
    throw error;
  }
};
