import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { staticPlugin } from '@elysiajs/static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import routes from the app directory
import { setupRoutes } from '../app/routes';

// Create the main application
const app = new Elysia()
  .use(html())
  .use(staticPlugin({
    assets: join(__dirname, '../static'),
    prefix: '/static'
  }))
  .use(setupRoutes)
  .listen(3000);

console.log(`🚀 Elysium server is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
