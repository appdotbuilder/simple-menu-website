
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { pageContentsTable, menuItemsTable } from '../db/schema';
import { type CreatePageContentInput, type CreateMenuItemInput } from '../schema';
import { createPageContent } from '../handlers/create_page_content';
import { eq } from 'drizzle-orm';

// Helper function to create a menu item for testing
const createTestMenuItem = async (): Promise<number> => {
  const menuItemInput: CreateMenuItemInput = {
    name: 'Test Page',
    slug: 'test-page',
    order: 1,
    is_active: true
  };

  const result = await db.insert(menuItemsTable)
    .values(menuItemInput)
    .returning()
    .execute();

  return result[0].id;
};

const testInput: CreatePageContentInput = {
  menu_item_id: 0, // Will be set dynamically in tests
  title: 'Test Page Title',
  content: 'This is test page content with HTML and text.',
  meta_description: 'A test page for unit testing',
  meta_keywords: 'test, page, content'
};

describe('createPageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create page content with all fields', async () => {
    const menuItemId = await createTestMenuItem();
    const input = { ...testInput, menu_item_id: menuItemId };

    const result = await createPageContent(input);

    expect(result.menu_item_id).toEqual(menuItemId);
    expect(result.title).toEqual('Test Page Title');
    expect(result.content).toEqual(testInput.content);
    expect(result.meta_description).toEqual('A test page for unit testing');
    expect(result.meta_keywords).toEqual('test, page, content');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create page content with optional null fields', async () => {
    const menuItemId = await createTestMenuItem();
    const input: CreatePageContentInput = {
      menu_item_id: menuItemId,
      title: 'Minimal Page',
      content: 'Basic content',
      meta_description: null,
      meta_keywords: null
    };

    const result = await createPageContent(input);

    expect(result.title).toEqual('Minimal Page');
    expect(result.content).toEqual('Basic content');
    expect(result.meta_description).toBeNull();
    expect(result.meta_keywords).toBeNull();
  });

  it('should create page content with undefined optional fields', async () => {
    const menuItemId = await createTestMenuItem();
    const input: CreatePageContentInput = {
      menu_item_id: menuItemId,
      title: 'Another Page',
      content: 'More content'
      // meta_description and meta_keywords omitted
    };

    const result = await createPageContent(input);

    expect(result.title).toEqual('Another Page');
    expect(result.content).toEqual('More content');
    expect(result.meta_description).toBeNull();
    expect(result.meta_keywords).toBeNull();
  });

  it('should save page content to database', async () => {
    const menuItemId = await createTestMenuItem();
    const input = { ...testInput, menu_item_id: menuItemId };

    const result = await createPageContent(input);

    const pageContents = await db.select()
      .from(pageContentsTable)
      .where(eq(pageContentsTable.id, result.id))
      .execute();

    expect(pageContents).toHaveLength(1);
    expect(pageContents[0].menu_item_id).toEqual(menuItemId);
    expect(pageContents[0].title).toEqual('Test Page Title');
    expect(pageContents[0].content).toEqual(testInput.content);
    expect(pageContents[0].meta_description).toEqual('A test page for unit testing');
    expect(pageContents[0].meta_keywords).toEqual('test, page, content');
    expect(pageContents[0].created_at).toBeInstanceOf(Date);
    expect(pageContents[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error when menu item does not exist', async () => {
    const input = { ...testInput, menu_item_id: 999999 };

    await expect(createPageContent(input)).rejects.toThrow(/menu item.*does not exist/i);
  });

  it('should validate foreign key relationship', async () => {
    const menuItemId = await createTestMenuItem();
    const input = { ...testInput, menu_item_id: menuItemId };

    const result = await createPageContent(input);

    // Verify the page content is linked to the correct menu item
    const menuItems = await db.select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, result.menu_item_id))
      .execute();

    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].id).toEqual(menuItemId);
    expect(menuItems[0].name).toEqual('Test Page');
  });
});
