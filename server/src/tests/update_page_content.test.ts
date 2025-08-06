
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { menuItemsTable, pageContentsTable } from '../db/schema';
import { type UpdatePageContentInput, type CreateMenuItemInput } from '../schema';
import { updatePageContent } from '../handlers/update_page_content';
import { eq } from 'drizzle-orm';

describe('updatePageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  let testMenuItemId: number;
  let testPageContentId: number;

  beforeEach(async () => {
    // Create a test menu item first
    const menuItemResult = await db.insert(menuItemsTable)
      .values({
        name: 'Test Menu',
        slug: 'test-menu',
        order: 1,
        is_active: true
      })
      .returning()
      .execute();
    
    testMenuItemId = menuItemResult[0].id;

    // Create a test page content record
    const pageContentResult = await db.insert(pageContentsTable)
      .values({
        menu_item_id: testMenuItemId,
        title: 'Original Title',
        content: 'Original content',
        meta_description: 'Original meta description',
        meta_keywords: 'original, keywords'
      })
      .returning()
      .execute();
    
    testPageContentId = pageContentResult[0].id;
  });

  it('should update all fields when provided', async () => {
    const input: UpdatePageContentInput = {
      id: testPageContentId,
      title: 'Updated Title',
      content: 'Updated content here',
      meta_description: 'Updated meta description',
      meta_keywords: 'updated, keywords, test'
    };

    const result = await updatePageContent(input);

    expect(result.id).toEqual(testPageContentId);
    expect(result.menu_item_id).toEqual(testMenuItemId);
    expect(result.title).toEqual('Updated Title');
    expect(result.content).toEqual('Updated content here');
    expect(result.meta_description).toEqual('Updated meta description');
    expect(result.meta_keywords).toEqual('updated, keywords, test');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update only specified fields', async () => {
    const input: UpdatePageContentInput = {
      id: testPageContentId,
      title: 'Only Title Updated'
    };

    const result = await updatePageContent(input);

    expect(result.title).toEqual('Only Title Updated');
    expect(result.content).toEqual('Original content'); // Should remain unchanged
    expect(result.meta_description).toEqual('Original meta description'); // Should remain unchanged
    expect(result.meta_keywords).toEqual('original, keywords'); // Should remain unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should handle null values for optional fields', async () => {
    const input: UpdatePageContentInput = {
      id: testPageContentId,
      meta_description: null,
      meta_keywords: null
    };

    const result = await updatePageContent(input);

    expect(result.meta_description).toBeNull();
    expect(result.meta_keywords).toBeNull();
    expect(result.title).toEqual('Original Title'); // Should remain unchanged
  });

  it('should save changes to database', async () => {
    const input: UpdatePageContentInput = {
      id: testPageContentId,
      title: 'Database Test Title',
      content: 'Database test content'
    };

    await updatePageContent(input);

    // Query database directly to verify changes
    const pageContents = await db.select()
      .from(pageContentsTable)
      .where(eq(pageContentsTable.id, testPageContentId))
      .execute();

    expect(pageContents).toHaveLength(1);
    expect(pageContents[0].title).toEqual('Database Test Title');
    expect(pageContents[0].content).toEqual('Database test content');
    expect(pageContents[0].updated_at).toBeInstanceOf(Date);
  });

  it('should update the updated_at timestamp', async () => {
    // Get original timestamp
    const originalRecord = await db.select()
      .from(pageContentsTable)
      .where(eq(pageContentsTable.id, testPageContentId))
      .execute();
    
    const originalTimestamp = originalRecord[0].updated_at;

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const input: UpdatePageContentInput = {
      id: testPageContentId,
      title: 'Timestamp Test'
    };

    const result = await updatePageContent(input);

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalTimestamp.getTime());
  });

  it('should throw error when page content not found', async () => {
    const input: UpdatePageContentInput = {
      id: 999999, // Non-existent ID
      title: 'This should fail'
    };

    await expect(updatePageContent(input)).rejects.toThrow(/not found/i);
  });
});
