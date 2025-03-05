import { Elysia } from 'elysia';
import { BaseLayout } from '../layouts/BaseLayout';
import { HomePage } from './home';
import { AboutPage } from './about';
import { todoRoutes } from './api/todos';

// Setup all routes
export const setupRoutes = new Elysia()
  // API routes
  .group('/api', app => app
    .use(todoRoutes)
  )
  
  // Page routes
  .get('/', ({ html }) => html(
    <BaseLayout>
      <HomePage />
    </BaseLayout>
  ))
  .get('/about', ({ html }) => html(
    <BaseLayout>
      <AboutPage />
    </BaseLayout>
  ));
