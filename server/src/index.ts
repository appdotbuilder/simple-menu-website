
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import { 
  createMenuItemInputSchema,
  updateMenuItemInputSchema,
  createPageContentInputSchema,
  updatePageContentInputSchema,
  getPageBySlugInputSchema
} from './schema';

// Import handlers
import { createMenuItem } from './handlers/create_menu_item';
import { getMenuItems } from './handlers/get_menu_items';
import { updateMenuItem } from './handlers/update_menu_item';
import { createPageContent } from './handlers/create_page_content';
import { updatePageContent } from './handlers/update_page_content';
import { getPageBySlug } from './handlers/get_page_by_slug';
import { getAllPages } from './handlers/get_all_pages';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Menu item routes
  createMenuItem: publicProcedure
    .input(createMenuItemInputSchema)
    .mutation(({ input }) => createMenuItem(input)),
  
  getMenuItems: publicProcedure
    .query(() => getMenuItems()),
  
  updateMenuItem: publicProcedure
    .input(updateMenuItemInputSchema)
    .mutation(({ input }) => updateMenuItem(input)),

  // Page content routes
  createPageContent: publicProcedure
    .input(createPageContentInputSchema)
    .mutation(({ input }) => createPageContent(input)),
  
  updatePageContent: publicProcedure
    .input(updatePageContentInputSchema)
    .mutation(({ input }) => updatePageContent(input)),

  // Public page routes for frontend
  getPageBySlug: publicProcedure
    .input(getPageBySlugInputSchema)
    .query(({ input }) => getPageBySlug(input)),
  
  getAllPages: publicProcedure
    .query(() => getAllPages()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
