
import { db } from '../db';
import { menuItemsTable } from '../db/schema';
import { type CreateMenuItemInput, type MenuItem } from '../schema';
import { eq } from 'drizzle-orm';

export const createMenuItem = async (input: CreateMenuItemInput): Promise<MenuItem> => {
  try {
    // Check if slug already exists
    const existingItem = await db.select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.slug, input.slug))
      .execute();

    if (existingItem.length > 0) {
      throw new Error(`Menu item with slug '${input.slug}' already exists`);
    }

    // Insert menu item record
    const result = await db.insert(menuItemsTable)
      .values({
        name: input.name,
        slug: input.slug,
        order: input.order,
        is_active: input.is_active,
        updated_at: new Date()
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Menu item creation failed:', error);
    throw error;
  }
};
