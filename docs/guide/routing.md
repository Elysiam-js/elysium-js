# Routing

Elysium-js uses a file-based routing system similar to SvelteKit's app router. Routes are defined in the `app/routes` directory.

## Page Routes

Page routes are used to render HTML pages. They are defined in the `app/routes` directory.

### Creating a Page Route

Create a new file in `app/routes` to define a page route:

```tsx
// app/routes/example.tsx
export const ExamplePage = () => {
  return (
    <div>
      <h1>Example Page</h1>
      <p>This is an example page.</p>
    </div>
  );
};
```

Then register it in `app/routes/index.ts`:

```typescript
import { ExamplePage } from './example';

export const setupRoutes = new Elysia()
  // ... existing routes
  .get('/example', ({ html }) => html(
    <BaseLayout>
      <ExamplePage />
    </BaseLayout>
  ));
```

### Route Parameters

You can use route parameters to capture values from the URL:

```typescript
// app/routes/index.ts
export const setupRoutes = new Elysia()
  // ... existing routes
  .get('/users/:id', ({ params, html }) => html(
    <BaseLayout>
      <UserPage id={params.id} />
    </BaseLayout>
  ));
```

```tsx
// app/routes/users.tsx
export const UserPage = ({ id }: { id: string }) => {
  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {id}</p>
    </div>
  );
};
```

### Query Parameters

You can access query parameters from the URL:

```typescript
// app/routes/index.ts
export const setupRoutes = new Elysia()
  // ... existing routes
  .get('/search', ({ query, html }) => html(
    <BaseLayout>
      <SearchPage query={query.q} />
    </BaseLayout>
  ));
```

```tsx
// app/routes/search.tsx
export const SearchPage = ({ query }: { query?: string }) => {
  return (
    <div>
      <h1>Search Results</h1>
      <p>Query: {query || 'No query provided'}</p>
    </div>
  );
};
```

## API Routes

API routes are used to create RESTful APIs. They are defined in the `app/routes/api` directory.

### Creating an API Route

```typescript
// app/routes/api/example.ts
import { Elysia, t } from 'elysia';

export const exampleRoutes = new Elysia({ prefix: '/example' })
  .get('/', () => {
    return { message: 'Hello from the API!' };
  })
  .post('/', ({ body }) => {
    return { message: `Received: ${body.data}` };
  }, {
    body: t.Object({
      data: t.String()
    })
  });
```

Then register it in `app/routes/index.ts`:

```typescript
import { exampleRoutes } from './api/example';

export const setupRoutes = new Elysia()
  .group('/api', app => app
    .use(exampleRoutes)
    // ... other API routes
  );
```

### Route Parameters in API Routes

You can use route parameters in API routes:

```typescript
// app/routes/api/users.ts
import { Elysia } from 'elysia';
import { db } from '../../db';
import { users } from '../../models/user';
import { eq } from 'drizzle-orm';

export const userRoutes = new Elysia({ prefix: '/users' })
  .get('/:id', async ({ params }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(params.id))
    });
    
    if (!user) {
      return new Response('User not found', { status: 404 });
    }
    
    return user;
  });
```

### Validation

Elysia provides built-in validation for request bodies, query parameters, and route parameters:

```typescript
// app/routes/api/todos.ts
import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { todos } from '../../models/todo';

export const todoRoutes = new Elysia({ prefix: '/todos' })
  .post('/', async ({ body }) => {
    const newTodo = await db.insert(todos).values(body).returning();
    return newTodo[0];
  }, {
    body: t.Object({
      title: t.String(),
      completed: t.Optional(t.Boolean())
    })
  });
```

## Combining Page and API Routes

In `app/routes/index.ts`, you can combine page and API routes:

```typescript
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { BaseLayout } from '../layouts/BaseLayout';
import { HomePage } from './home';
import { AboutPage } from './about';
import { todoRoutes } from './api/todos';
import { userRoutes } from './api/users';

export const setupRoutes = new Elysia()
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
  ))
  
  // API routes
  .group('/api', app => app
    .use(todoRoutes)
    .use(userRoutes)
  );
```

## HTMX Integration

You can use HTMX to create interactive UIs without writing JavaScript. Here's an example of a todo list with HTMX:

```tsx
// app/routes/home.tsx
export const HomePage = () => {
  return (
    <div>
      <h1>Todo List</h1>
      
      <form 
        hx-post="/api/todos" 
        hx-target="#todo-list" 
        hx-swap="beforeend"
        hx-on::after-request="this.reset()"
      >
        <input type="text" name="title" placeholder="Add a new todo" required />
        <button type="submit">Add</button>
      </form>
      
      <div id="todo-list" hx-get="/api/todos" hx-trigger="load">
        {/* Todos will be loaded here */}
      </div>
    </div>
  );
};
```

```typescript
// app/routes/api/todos.ts
import { Elysia, t } from 'elysia';
import { html } from '@elysiajs/html';
import { db } from '../../db';
import { todos } from '../../models/todo';

export const todoRoutes = new Elysia({ prefix: '/todos' })
  .get('/', async ({ html }) => {
    const allTodos = await db.query.todos.findMany();
    
    return html(
      <>
        {allTodos.map(todo => (
          <div class="todo-item" id={`todo-${todo.id}`}>
            <input 
              type="checkbox" 
              checked={todo.completed} 
              hx-put={`/api/todos/${todo.id}/toggle`}
              hx-target={`#todo-${todo.id}`}
              hx-swap="outerHTML"
            />
            <span class={todo.completed ? 'completed' : ''}>
              {todo.title}
            </span>
            <button 
              hx-delete={`/api/todos/${todo.id}`}
              hx-target={`#todo-${todo.id}`}
              hx-swap="outerHTML"
            >
              Delete
            </button>
          </div>
        ))}
      </>
    );
  })
  .post('/', async ({ body, html }) => {
    const [newTodo] = await db.insert(todos).values(body).returning();
    
    return html(
      <div class="todo-item" id={`todo-${newTodo.id}`}>
        <input 
          type="checkbox" 
          checked={newTodo.completed} 
          hx-put={`/api/todos/${newTodo.id}/toggle`}
          hx-target={`#todo-${newTodo.id}`}
          hx-swap="outerHTML"
        />
        <span>{newTodo.title}</span>
        <button 
          hx-delete={`/api/todos/${newTodo.id}`}
          hx-target={`#todo-${newTodo.id}`}
          hx-swap="outerHTML"
        >
          Delete
        </button>
      </div>
    );
  }, {
    body: t.Object({
      title: t.String(),
      completed: t.Optional(t.Boolean())
    })
  });
```

This example demonstrates how to:
1. Create a form that submits data to an API endpoint
2. Load data from an API endpoint when the page loads
3. Update data with PUT requests
4. Delete data with DELETE requests

All without writing a single line of JavaScript!
