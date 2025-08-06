
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { menuItemsTable } from '../db/schema';
import { type UpdateMenuItemInput, type CreateMenuItemInput } from '../schema';
import { updateMenuItem } from '../handlers/update_menu_item';
import { eq } from 'drizzle-orm';

// Helper to create a test menu item
const createTestMenuItem = async (data: CreateMenuItemInput) => {
  const result = await db.insert(menuItemsTable)
    .values({
      name: data.name,
      slug: data.slug,
      order: data.order,
      is_active: data.is_active
    })
    .returning()
    .execute();
  return result[0];
};

describe('updateMenuItem', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a menu item name', async () => {
    // Create test menu item
    const menuItem = await createTestMenuItem({
      name: 'Original Name',
      slug: 'original-slug',
      order: 1,
      is_active: true
    });

    const input: UpdateMenuItemInput = {
      id: menuItem.id,
      name: 'Updated Name'
    };

    const result = await updateMenuItem(input);

    expect(result.id).toEqual(menuItem.id);
    expect(result.name).toEqual('Updated Name');
    expect(result.slug).toEqual('original-slug'); // Should remain unchanged
    expect(result.order).toEqual(1);
    expect(result.is_active).toEqual(true);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > menuItem.updated_at).toBe(true);
  });

  it('should update multiple fields at once', async () => {
    // Create test menu item
    const menuItem = await createTestMenuItem({
      name: 'Original Name',
      slug: 'original-slug',
      order: 1,
      is_active: true
    });

    const input: UpdateMenuItemInput = {
      id: menuItem.id,
      name: 'New Name',
      slug: 'new-slug',
      order: 5,
      is_active: false
    };

    const result = await updateMenuItem(input);

    expect(result.id).toEqual(menuItem.id);
    expect(result.name).toEqual('New Name');
    expect(result.slug).toEqual('new-slug');
    expect(result.order).toEqual(5);
    expect(result.is_active).toEqual(false);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save updated menu item to database', async () => {
    // Create test menu item
    const menuItem = await createTestMenuItem({
      name: 'Original Name',
      slug: 'original-slug',
      order: 1,
      is_active: true
    });

    const input: UpdateMenuItemInput = {
      id: menuItem.id,
      name: 'Database Test Name',
      order: 10
    };

    await updateMenuItem(input);

    // Verify changes were saved
    const saved = await db.select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, menuItem.id))
      .execute();

    expect(saved).toHaveLength(1);
    expect(saved[0].name).toEqual('Database Test Name');
    expect(saved[0].order).toEqual(10);
    expect(saved[0].slug).toEqual('original-slug'); // Unchanged
  });

  it('should throw error when menu item does not exist', async () => {
    const input: UpdateMenuItemInput = {
      id: 999,
      name: 'Nonexistent Item'
    };

    expect(updateMenuItem(input)).rejects.toThrow(/not found/i);
  });

  it('should throw error when slug already exists', async () => {
    // Create two test menu items
    await createTestMenuItem({
      name: 'First Item',
      slug: 'existing-slug',
      order: 1,
      is_active: true
    });

    const secondItem = await createTestMenuItem({
      name: 'Second Item',
      slug: 'second-slug',
      order: 2,
      is_active: true
    });

    // Try to update second item with existing slug
    const input: UpdateMenuItemInput = {
      id: secondItem.id,
      slug: 'existing-slug'
    };

    expect(updateMenuItem(input)).rejects.toThrow(/already exists/i);
  });

  it('should allow updating item with its own slug', async () => {
    // Create test menu item
    const menuItem = await createTestMenuItem({
      name: 'Test Item',
      slug: 'test-slug',
      order: 1,
      is_active: true
    });

    // Update item with same slug (should be allowed)
    const input: UpdateMenuItemInput = {
      id: menuItem.id,
      name: 'Updated Name',
      slug: 'test-slug' // Same slug
    };

    const result = await updateMenuItem(input);

    expect(result.name).toEqual('Updated Name');
    expect(result.slug).toEqual('test-slug');
  });

  it('should update only provided fields', async () => {
    // Create test menu item
    const menuItem = await createTestMenuItem({
      name: 'Original Name',
      slug: 'original-slug',
      order: 1,
      is_active: true
    });

    const input: UpdateMenuItemInput = {
      id: menuItem.id,
      is_active: false // Only update is_active
    };

    const result = await updateMenuItem(input);

    expect(result.name).toEqual('Original Name'); // Should remain unchanged
    expect(result.slug).toEqual('original-slug'); // Should remain unchanged
    expect(result.order).toEqual(1); // Should remain unchanged
    expect(result.is_active).toEqual(false); // Should be updated
  });
});
