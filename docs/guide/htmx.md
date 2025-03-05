# HTMX Integration

[HTMX](https://htmx.org/) is a library that allows you to access modern browser features directly from HTML, rather than using JavaScript. Elysium-js integrates seamlessly with HTMX to create dynamic, interactive web applications with minimal JavaScript.

## Setting Up HTMX

To use HTMX in your Elysium-js application, include the HTMX script in your layout:

```tsx
// app/layouts/BaseLayout.tsx
import { PropsWithChildren } from 'hono/jsx';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <head>
        <title>Elysium-js</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/main.css" />
        <script src="https://unpkg.com/htmx.org@1.9.6"></script>
      </head>
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
        </header>
        
        <main>
          {children}
        </main>
        
        <footer>
          <p>&copy; 2025 Elysium-js</p>
        </footer>
      </body>
    </html>
  );
};
```

## Basic HTMX Attributes

HTMX provides several attributes that you can use to create interactive UIs:

- `hx-get`: Makes a GET request to the specified URL
- `hx-post`: Makes a POST request to the specified URL
- `hx-put`: Makes a PUT request to the specified URL
- `hx-delete`: Makes a DELETE request to the specified URL
- `hx-patch`: Makes a PATCH request to the specified URL
- `hx-target`: Specifies the target element to update with the response
- `hx-swap`: Specifies how to swap the response into the target element
- `hx-trigger`: Specifies the event that triggers the request
- `hx-push-url`: Pushes the URL into the browser's history

## Examples

### Loading Content on Page Load

```tsx
<div hx-get="/api/todos" hx-trigger="load">
  <!-- Todos will be loaded here -->
</div>
```

### Form Submission

```tsx
<form 
  hx-post="/api/todos" 
  hx-target="#todo-list" 
  hx-swap="beforeend"
  hx-on::after-request="this.reset()"
>
  <input type="text" name="title" placeholder="Add a new todo" required />
  <button type="submit">Add</button>
</form>

<div id="todo-list">
  <!-- New todos will be added here -->
</div>
```

### Click Events

```tsx
<button 
  hx-get="/api/todos" 
  hx-target="#todo-list" 
  hx-swap="innerHTML"
>
  Refresh Todos
</button>
```

### Deleting Items

```tsx
<button 
  hx-delete="/api/todos/123" 
  hx-target="#todo-123" 
  hx-swap="outerHTML"
>
  Delete
</button>
```

### Updating Items

```tsx
<input 
  type="checkbox" 
  hx-put="/api/todos/123/toggle" 
  hx-target="#todo-123" 
  hx-swap="outerHTML"
/>
```

## Server-Side Implementation

On the server side, you need to handle HTMX requests and return HTML fragments:

```typescript
// app/routes/api/todos.ts
import { Elysia, t } from 'elysia';
import { html } from '@elysiajs/html';
import { db } from '../../db';
import { todos } from '../../models/todo';
import { eq } from 'drizzle-orm';

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
  })
  .put('/:id/toggle', async ({ params, html }) => {
    const id = parseInt(params.id);
    const todo = await db.query.todos.findFirst({
      where: eq(todos.id, id)
    });
    
    if (!todo) {
      return new Response('Todo not found', { status: 404 });
    }
    
    const [updatedTodo] = await db
      .update(todos)
      .set({ completed: !todo.completed })
      .where(eq(todos.id, id))
      .returning();
    
    return html(
      <div class="todo-item" id={`todo-${updatedTodo.id}`}>
        <input 
          type="checkbox" 
          checked={updatedTodo.completed} 
          hx-put={`/api/todos/${updatedTodo.id}/toggle`}
          hx-target={`#todo-${updatedTodo.id}`}
          hx-swap="outerHTML"
        />
        <span class={updatedTodo.completed ? 'completed' : ''}>
          {updatedTodo.title}
        </span>
        <button 
          hx-delete={`/api/todos/${updatedTodo.id}`}
          hx-target={`#todo-${updatedTodo.id}`}
          hx-swap="outerHTML"
        >
          Delete
        </button>
      </div>
    );
  })
  .delete('/:id', async ({ params }) => {
    await db
      .delete(todos)
      .where(eq(todos.id, parseInt(params.id)));
    
    return '';
  });
```

## Advanced HTMX Features

### Triggering Events

You can trigger events on different actions:

```tsx
<button 
  hx-post="/api/todos" 
  hx-trigger="click"
  hx-target="#todo-list"
  hx-swap="beforeend"
>
  Add Todo
</button>
```

### Custom Events

You can trigger requests on custom events:

```tsx
<div hx-get="/api/todos" hx-trigger="refresh-todos from:body">
  <!-- Todos will be loaded here -->
</div>

<button onclick="document.body.dispatchEvent(new Event('refresh-todos'))">
  Refresh Todos
</button>
```

### Loading Indicators

You can show loading indicators during requests:

```tsx
<button 
  hx-get="/api/todos" 
  hx-target="#todo-list" 
  hx-indicator="#loading"
>
  Load Todos
</button>

<div id="loading" class="htmx-indicator">
  Loading...
</div>
```

Add the following CSS:

```css
.htmx-indicator {
  display: none;
}
.htmx-request .htmx-indicator {
  display: block;
}
```

### Confirming Actions

You can confirm actions before they're executed:

```tsx
<button 
  hx-delete="/api/todos/123" 
  hx-target="#todo-123" 
  hx-confirm="Are you sure you want to delete this todo?"
>
  Delete
</button>
```

### Polling

You can poll for updates:

```tsx
<div 
  hx-get="/api/todos" 
  hx-trigger="every 5s"
>
  <!-- Todos will be updated every 5 seconds -->
</div>
```

## Complete Todo List Example

Here's a complete example of a todo list application using HTMX:

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
import { eq } from 'drizzle-orm';

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
              hx-confirm="Are you sure you want to delete this todo?"
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
          hx-confirm="Are you sure you want to delete this todo?"
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
  })
  .put('/:id/toggle', async ({ params, html }) => {
    const id = parseInt(params.id);
    const todo = await db.query.todos.findFirst({
      where: eq(todos.id, id)
    });
    
    if (!todo) {
      return new Response('Todo not found', { status: 404 });
    }
    
    const [updatedTodo] = await db
      .update(todos)
      .set({ completed: !todo.completed })
      .where(eq(todos.id, id))
      .returning();
    
    return html(
      <div class="todo-item" id={`todo-${updatedTodo.id}`}>
        <input 
          type="checkbox" 
          checked={updatedTodo.completed} 
          hx-put={`/api/todos/${updatedTodo.id}/toggle`}
          hx-target={`#todo-${updatedTodo.id}`}
          hx-swap="outerHTML"
        />
        <span class={updatedTodo.completed ? 'completed' : ''}>
          {updatedTodo.title}
        </span>
        <button 
          hx-delete={`/api/todos/${updatedTodo.id}`}
          hx-target={`#todo-${updatedTodo.id}`}
          hx-swap="outerHTML"
          hx-confirm="Are you sure you want to delete this todo?"
        >
          Delete
        </button>
      </div>
    );
  })
  .delete('/:id', async ({ params }) => {
    await db
      .delete(todos)
      .where(eq(todos.id, parseInt(params.id)));
    
    return '';
  });
```

```css
/* static/styles/main.css */
.todo-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.todo-item span {
  margin: 0 0.5rem;
}

.todo-item span.completed {
  text-decoration: line-through;
  color: #888;
}

.todo-item button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.htmx-indicator {
  display: none;
}

.htmx-request .htmx-indicator {
  display: inline;
}
```

## Best Practices

- Use HTMX for simple interactions and dynamic content updates
- Keep your HTML fragments small and focused
- Use CSS transitions for smooth UI updates
- Use the `hx-boost` attribute to speed up navigation between pages
- Use the `hx-push-url` attribute to update the browser's URL
- Use the `hx-trigger` attribute to control when requests are made
- Use the `hx-indicator` attribute to show loading indicators
- Use the `hx-confirm` attribute to confirm destructive actions
