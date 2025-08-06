
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { menuItemsTable, pageContentsTable } from '../db/schema';
import { getAllPages } from '../handlers/get_all_pages';

describe('getAllPages', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no pages exist', async () => {
    const result = await getAllPages();
    expect(result).toEqual([]);
  });

  it('should return all active pages with their content ordered by menu order', async () => {
    // Create test menu items
    const menuItems = await db.insert(menuItemsTable)
      .values([
        {
          name: 'Home',
          slug: 'home',
          order: 1,
          is_active: true
        },
        {
          name: 'About',
          slug: 'about',
          order: 2,
          is_active: true
        },
        {
          name: 'Contact',
          slug: 'contact',
          order: 3,
          is_active: true
        }
      ])
      .returning()
      .execute();

    // Create corresponding page content
    await db.insert(pageContentsTable)
      .values([
        {
          menu_item_id: menuItems[0].id,
          title: 'Welcome to Home',
          content: 'This is the home page content',
          meta_description: 'Home page description',
          meta_keywords: 'home, welcome'
        },
        {
          menu_item_id: menuItems[1].id,
          title: 'About Us',
          content: 'This is the about page content',
          meta_description: 'About page description',
          meta_keywords: 'about, company'
        },
        {
          menu_item_id: menuItems[2].id,
          title: 'Contact Information',
          content: 'This is the contact page content',
          meta_description: null,
          meta_keywords: null
        }
      ])
      .execute();

    const result = await getAllPages();

    expect(result).toHaveLength(3);
    
    // Verify ordering by menu item order
    expect(result[0].name).toEqual('Home');
    expect(result[0].slug).toEqual('home');
    expect(result[0].order).toEqual(1);
    expect(result[1].name).toEqual('About');
    expect(result[1].order).toEqual(2);
    expect(result[2].name).toEqual('Contact');
    expect(result[2].order).toEqual(3);

    // Verify page content fields
    expect(result[0].title).toEqual('Welcome to Home');
    expect(result[0].content).toEqual('This is the home page content');
    expect(result[0].meta_description).toEqual('Home page description');
    expect(result[0].meta_keywords).toEqual('home, welcome');
    expect(result[0].is_active).toBe(true);
    expect(result[0].menu_item_id).toEqual(menuItems[0].id);

    // Verify nullable fields are handled correctly
    expect(result[2].meta_description).toBeNull();
    expect(result[2].meta_keywords).toBeNull();
  });

  it('should only return active menu items', async () => {
    // Create active and inactive menu items
    const menuItems = await db.insert(menuItemsTable)
      .values([
        {
          name: 'Active Page',
          slug: 'active',
          order: 1,
          is_active: true
        },
        {
          name: 'Inactive Page',
          slug: 'inactive',
          order: 2,
          is_active: false
        }
      ])
      .returning()
      .execute();

    // Create page content for both
    await db.insert(pageContentsTable)
      .values([
        {
          menu_item_id: menuItems[0].id,
          title: 'Active Page Title',
          content: 'Active page content',
          meta_description: 'Active description',
          meta_keywords: 'active'
        },
        {
          menu_item_id: menuItems[1].id,
          title: 'Inactive Page Title',
          content: 'Inactive page content',
          meta_description: 'Inactive description',
          meta_keywords: 'inactive'
        }
      ])
      .execute();

    const result = await getAllPages();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Active Page');
    expect(result[0].is_active).toBe(true);
  });

  it('should handle pages with mixed order values correctly', async () => {
    // Create menu items with non-sequential order values
    const menuItems = await db.insert(menuItemsTable)
      .values([
        {
          name: 'Third',
          slug: 'third',
          order: 30,
          is_active: true
        },
        {
          name: 'First',
          slug: 'first',
          order: 10,
          is_active: true
        },
        {
          name: 'Second',
          slug: 'second',
          order: 20,
          is_active: true
        }
      ])
      .returning()
      .execute();

    // Create corresponding page content
    await db.insert(pageContentsTable)
      .values([
        {
          menu_item_id: menuItems[0].id,
          title: 'Third Page',
          content: 'Third page content',
          meta_description: 'Third description',
          meta_keywords: 'third'
        },
        {
          menu_item_id: menuItems[1].id,
          title: 'First Page',
          content: 'First page content',
          meta_description: 'First description',
          meta_keywords: 'first'
        },
        {
          menu_item_id: menuItems[2].id,
          title: 'Second Page',
          content: 'Second page content',
          meta_description: 'Second description',
          meta_keywords: 'second'
        }
      ])
      .execute();

    const result = await getAllPages();

    expect(result).toHaveLength(3);
    // Verify correct ordering despite insertion order
    expect(result[0].name).toEqual('First');
    expect(result[0].order).toEqual(10);
    expect(result[1].name).toEqual('Second');
    expect(result[1].order).toEqual(20);
    expect(result[2].name).toEqual('Third');
    expect(result[2].order).toEqual(30);
  });
});
