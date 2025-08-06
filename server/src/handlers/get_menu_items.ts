
import { db } from '../db';
import { menuItemsTable } from '../db/schema';
import { type MenuItem } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const results = await db.select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.is_active, true))
      .orderBy(asc(menuItemsTable.order))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    throw error;
  }
};
