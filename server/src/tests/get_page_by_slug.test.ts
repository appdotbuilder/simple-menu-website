
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { menuItemsTable, pageContentsTable } from '../db/schema';
import { type GetPageBySlugInput } from '../schema';
import { getPageBySlug } from '../handlers/get_page_by_slug';

describe('getPageBySlug', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return page data for active menu item with existing slug', async () => {
    // Create test menu item
    const menuItems = await db.insert(menuItemsTable)
      .values({
        name: 'About Us',
        slug: 'about-us',
        order: 1,
        is_active: true
      })
      .returning()
      .execute();

    // Create associated page content
    await db.insert(pageContentsTable)
      .values({
        menu_item_id: menuItems[0].id,
        title: 'About Our Company',
        content: 'We are a great company with amazing products.',
        meta_description: 'Learn about our company',
        meta_keywords: 'about, company, team'
      })
      .execute();

    const input: GetPageBySlugInput = { slug: 'about-us' };
    const result = await getPageBySlug(input);

    expect(result).not.toBeNull();
    expect(result!.name).toEqual('About Us');
    expect(result!.slug).toEqual('about-us');
    expect(result!.title).toEqual('About Our Company');
    expect(result!.content).toEqual('We are a great company with amazing products.');
    expect(result!.meta_description).toEqual('Learn about our company');
    expect(result!.meta_keywords).toEqual('about, company, team');
    expect(result!.is_active).toBe(true);
    expect(result!.order).toEqual(1);
    expect(result!.menu_item_id).toEqual(menuItems[0].id);
  });

  it('should return null for non-existent slug', async () => {
    const input: GetPageBySlugInput = { slug: 'non-existent' };
    const result = await getPageBySlug(input);

    expect(result).toBeNull();
  });

  it('should return null for inactive menu item', async () => {
    // Create inactive menu item
    const menuItems = await db.insert(menuItemsTable)
      .values({
        name: 'Inactive Page',
        slug: 'inactive-page',
        order: 1,
        is_active: false
      })
      .returning()
      .execute();

    // Create associated page content
    await db.insert(pageContentsTable)
      .values({
        menu_item_id: menuItems[0].id,
        title: 'Inactive Page Title',
        content: 'This page should not be accessible.'
      })
      .execute();

    const input: GetPageBySlugInput = { slug: 'inactive-page' };
    const result = await getPageBySlug(input);

    expect(result).toBeNull();
  });

  it('should handle page content with null meta fields', async () => {
    // Create test menu item
    const menuItems = await db.insert(menuItemsTable)
      .values({
        name: 'Simple Page',
        slug: 'simple-page',
        order: 1,
        is_active: true
      })
      .returning()
      .execute();

    // Create page content with null meta fields
    await db.insert(pageContentsTable)
      .values({
        menu_item_id: menuItems[0].id,
        title: 'Simple Page Title',
        content: 'Simple content without meta data.',
        meta_description: null,
        meta_keywords: null
      })
      .execute();

    const input: GetPageBySlugInput = { slug: 'simple-page' };
    const result = await getPageBySlug(input);

    expect(result).not.toBeNull();
    expect(result!.name).toEqual('Simple Page');
    expect(result!.slug).toEqual('simple-page');
    expect(result!.title).toEqual('Simple Page Title');
    expect(result!.content).toEqual('Simple content without meta data.');
    expect(result!.meta_description).toBeNull();
    expect(result!.meta_keywords).toBeNull();
  });

  it('should return null when menu item exists but has no page content', async () => {
    // Create menu item without page content
    await db.insert(menuItemsTable)
      .values({
        name: 'Menu Only',
        slug: 'menu-only',
        order: 1,
        is_active: true
      })
      .execute();

    const input: GetPageBySlugInput = { slug: 'menu-only' };
    const result = await getPageBySlug(input);

    expect(result).toBeNull();
  });
});
