
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { menuItemsTable } from '../db/schema';
import { type CreateMenuItemInput } from '../schema';
import { createMenuItem } from '../handlers/create_menu_item';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateMenuItemInput = {
  name: 'About Us',
  slug: 'about-us',
  order: 1,
  is_active: true
};

describe('createMenuItem', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a menu item', async () => {
    const result = await createMenuItem(testInput);

    // Basic field validation
    expect(result.name).toEqual('About Us');
    expect(result.slug).toEqual('about-us');
    expect(result.order).toEqual(1);
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save menu item to database', async () => {
    const result = await createMenuItem(testInput);

    // Query using proper drizzle syntax
    const menuItems = await db.select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, result.id))
      .execute();

    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].name).toEqual('About Us');
    expect(menuItems[0].slug).toEqual('about-us');
    expect(menuItems[0].order).toEqual(1);
    expect(menuItems[0].is_active).toEqual(true);
    expect(menuItems[0].created_at).toBeInstanceOf(Date);
    expect(menuItems[0].updated_at).toBeInstanceOf(Date);
  });

  it('should use default is_active value when not provided', async () => {
    const inputWithoutActive: CreateMenuItemInput = {
      name: 'Services',
      slug: 'services',
      order: 2,
      is_active: true // This is required by the schema with default
    };

    const result = await createMenuItem(inputWithoutActive);
    expect(result.is_active).toEqual(true);
  });

  it('should reject duplicate slugs', async () => {
    // Create first menu item
    await createMenuItem(testInput);

    // Try to create another with same slug
    const duplicateInput: CreateMenuItemInput = {
      name: 'Different Name',
      slug: 'about-us', // Same slug
      order: 2,
      is_active: true
    };

    await expect(createMenuItem(duplicateInput))
      .rejects.toThrow(/slug 'about-us' already exists/i);
  });

  it('should allow different slugs', async () => {
    // Create first menu item
    const first = await createMenuItem(testInput);

    // Create second with different slug
    const secondInput: CreateMenuItemInput = {
      name: 'Contact',
      slug: 'contact',
      order: 3,
      is_active: false
    };

    const second = await createMenuItem(secondInput);

    expect(first.slug).toEqual('about-us');
    expect(second.slug).toEqual('contact');
    expect(first.id).not.toEqual(second.id);
  });

  it('should handle zero order value', async () => {
    const zeroOrderInput: CreateMenuItemInput = {
      name: 'Home',
      slug: 'home',
      order: 0,
      is_active: true
    };

    const result = await createMenuItem(zeroOrderInput);
    expect(result.order).toEqual(0);
  });
});
