
import { db } from '../db';
import { pageContentsTable } from '../db/schema';
import { type UpdatePageContentInput, type PageContent } from '../schema';
import { eq, sql } from 'drizzle-orm';

export const updatePageContent = async (input: UpdatePageContentInput): Promise<PageContent> => {
  try {
    // Build the update values object, only including provided fields
    const updateValues: any = {
      updated_at: sql`now()` // Always update the timestamp
    };

    if (input.title !== undefined) {
      updateValues.title = input.title;
    }
    if (input.content !== undefined) {
      updateValues.content = input.content;
    }
    if (input.meta_description !== undefined) {
      updateValues.meta_description = input.meta_description;
    }
    if (input.meta_keywords !== undefined) {
      updateValues.meta_keywords = input.meta_keywords;
    }

    // Update the page content record
    const result = await db.update(pageContentsTable)
      .set(updateValues)
      .where(eq(pageContentsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Page content with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Page content update failed:', error);
    throw error;
  }
};
