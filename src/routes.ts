import { Elysia } from 'elysia';
import { BaseHtml } from './components/layout';
import { HomePage } from './pages/home';
import { AboutPage } from './pages/about';
import { TodoController } from './controllers/todo.controller';

// Create the routes
export const routes = new Elysia({ prefix: '/' })
  // API routes
  .group('/api', app => app
    .group('/todos', app => app
      .get('/', TodoController.getAll)
      .post('/', TodoController.create)
      .get('/:id', TodoController.getById)
      .put('/:id', TodoController.update)
      .delete('/:id', TodoController.delete)
    )
  )
  
  // Page routes
  .get('/', ({ html }) => html(
    <BaseHtml>
      <HomePage />
    </BaseHtml>
  ))
  .get('/about', ({ html }) => html(
    <BaseHtml>
      <AboutPage />
    </BaseHtml>
  ));
