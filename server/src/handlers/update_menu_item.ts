
import { db } from '../db';
import { menuItemsTable } from '../db/schema';
import { type UpdateMenuItemInput, type MenuItem } from '../schema';
import { eq, and, ne } from 'drizzle-orm';

export const updateMenuItem = async (input: UpdateMenuItemInput): Promise<MenuItem> => {
  try {
    // Check if menu item exists
    const existing = await db.select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, input.id))
      .execute();

    if (existing.length === 0) {
      throw new Error(`Menu item with id ${input.id} not found`);
    }

    // If slug is being updated, check for uniqueness
    if (input.slug) {
      const slugExists = await db.select()
        .from(menuItemsTable)
        .where(
          and(
            eq(menuItemsTable.slug, input.slug),
            ne(menuItemsTable.id, input.id)
          )
        )
        .execute();

      if (slugExists.length > 0) {
        throw new Error(`Menu item with slug '${input.slug}' already exists`);
      }
    }

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date()
    };

    if (input.name !== undefined) updateData['name'] = input.name;
    if (input.slug !== undefined) updateData['slug'] = input.slug;
    if (input.order !== undefined) updateData['order'] = input.order;
    if (input.is_active !== undefined) updateData['is_active'] = input.is_active;

    // Update the menu item
    const result = await db.update(menuItemsTable)
      .set(updateData)
      .where(eq(menuItemsTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Menu item update failed:', error);
    throw error;
  }
};
