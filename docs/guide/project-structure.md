# Project Structure

Elysium-js follows a SvelteKit-inspired structure for organization and clarity. This structure is designed to be intuitive and scalable, making it easy to find and organize your code.

## Directory Structure

```
elysium-js/
├── app/                # Application code
│   ├── components/     # Reusable UI components
│   ├── db/             # Database configuration
│   ├── layouts/        # Layout components
│   ├── lib/            # Utility functions and shared code
│   ├── models/         # Data models
│   └── routes/         # Page and API routes
│       └── api/        # API endpoints
├── drizzle/            # Database migrations
├── static/             # Static assets
│   └── styles/         # CSS files
├── src/                # Source files
│   └── index.ts        # Application entry point
├── .gitignore
├── create-elysium.js   # CLI tool for project creation
├── drizzle.config.ts   # Drizzle ORM configuration
├── package.json
├── README.md
└── tsconfig.json
```

## Key Directories

### app/

The `app` directory contains all of your application code. This is where you'll spend most of your time developing.

#### app/components/

The `components` directory contains reusable UI components that can be used throughout your application. These components should be small, focused, and reusable.

Example:
```tsx
// app/components/Button.tsx
type ButtonProps = {
  text: string;
  onClick?: string;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
};

export const Button = ({ 
  text, 
  onClick, 
  type = 'button',
  variant = 'primary' 
}: ButtonProps) => {
  const baseClasses = "px-4 py-2 rounded-md";
  const variantClasses = variant === 'primary' 
    ? "bg-blue-600 text-white hover:bg-blue-700" 
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";
  
  return (
    <button 
      type={type}
      class={`${baseClasses} ${variantClasses}`}
      hx-on:click={onClick}
    >
      {text}
    </button>
  );
};
```

#### app/db/

The `db` directory contains your database configuration. This is where you'll set up your database connection and export your database client.

Example:
```typescript
// app/db/index.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../models/todo';

const client = createClient({
  url: 'file:./data.db',
  // For Turso cloud:
  // url: process.env.TURSO_DATABASE_URL,
  // authToken: process.env.TURSO_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
```

#### app/layouts/

The `layouts` directory contains layout components that provide a consistent structure for your pages.

Example:
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

#### app/lib/

The `lib` directory contains utility functions and shared code that can be used throughout your application.

#### app/models/

The `models` directory contains your data models. These models define the structure of your data and are used by your database client.

Example:
```typescript
// app/models/todo.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString())
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
```

#### app/routes/

The `routes` directory contains your page and API routes. This is where you'll define the routes for your application.

### static/

The `static` directory contains static assets that will be served directly by your application. This includes CSS files, images, and other assets.

### src/

The `src` directory contains your application's entry point. This is where you'll set up your Elysia server and configure your application.

Example:
```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { staticPlugin } from '@elysiajs/static';
import { setupRoutes } from '../app/routes';

const app = new Elysia()
  .use(html())
  .use(staticPlugin({
    assets: 'static',
    prefix: '/static'
  }))
  .use(setupRoutes)
  .listen(process.env.PORT || 3000);

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
```

## Best Practices

- Keep related files together in the same directory
- Use descriptive names for files and directories
- Split large components into smaller ones
- Use TypeScript interfaces for complex data structures
