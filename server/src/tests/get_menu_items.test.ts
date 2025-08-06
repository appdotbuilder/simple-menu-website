
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { menuItemsTable } from '../db/schema';
import { getMenuItems } from '../handlers/get_menu_items';

describe('getMenuItems', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no menu items exist', async () => {
    const result = await getMenuItems();
    expect(result).toEqual([]);
  });

  it('should return only active menu items', async () => {
    // Create test data
    await db.insert(menuItemsTable).values([
      {
        name: 'Active Item 1',
        slug: 'active-1',
        order: 1,
        is_active: true
      },
      {
        name: 'Inactive Item',
        slug: 'inactive',
        order: 2,
        is_active: false
      },
      {
        name: 'Active Item 2',
        slug: 'active-2',
        order: 3,
        is_active: true
      }
    ]).execute();

    const result = await getMenuItems();

    expect(result).toHaveLength(2);
    expect(result[0].name).toEqual('Active Item 1');
    expect(result[1].name).toEqual('Active Item 2');
    expect(result.every(item => item.is_active)).toBe(true);
  });

  it('should return menu items ordered by order field', async () => {
    // Create test data with mixed order values
    await db.insert(menuItemsTable).values([
      {
        name: 'Third Item',
        slug: 'third',
        order: 3,
        is_active: true
      },
      {
        name: 'First Item',
        slug: 'first',
        order: 1,
        is_active: true
      },
      {
        name: 'Second Item',
        slug: 'second',
        order: 2,
        is_active: true
      }
    ]).execute();

    const result = await getMenuItems();

    expect(result).toHaveLength(3);
    expect(result[0].name).toEqual('First Item');
    expect(result[0].order).toEqual(1);
    expect(result[1].name).toEqual('Second Item');
    expect(result[1].order).toEqual(2);
    expect(result[2].name).toEqual('Third Item');
    expect(result[2].order).toEqual(3);
  });

  it('should return complete menu item data', async () => {
    await db.insert(menuItemsTable).values({
      name: 'Test Menu Item',
      slug: 'test-menu-item',
      order: 1,
      is_active: true
    }).execute();

    const result = await getMenuItems();

    expect(result).toHaveLength(1);
    const menuItem = result[0];
    expect(menuItem.id).toBeDefined();
    expect(menuItem.name).toEqual('Test Menu Item');
    expect(menuItem.slug).toEqual('test-menu-item');
    expect(menuItem.order).toEqual(1);
    expect(menuItem.is_active).toBe(true);
    expect(menuItem.created_at).toBeInstanceOf(Date);
    expect(menuItem.updated_at).toBeInstanceOf(Date);
  });
});
