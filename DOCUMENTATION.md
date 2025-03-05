# Elysium-js Framework Documentation

## Overview

Elysium-js is a modern full-stack web framework built on the BETH stack:

- **B**un - Fast JavaScript runtime and package manager
- **E**lysia - TypeScript web framework for Bun
- **T**urso - SQLite database for the edge
- **H**TMX - HTML extensions for dynamic content

The framework provides a complete solution for building web applications with a focus on developer experience, performance, and scalability.

## Getting Started

### Creating a New Project

```bash
bun create elysium app
```

During project creation, you'll be prompted to select:
- ORM (Turso, Prisma, or Drizzle)
- Whether to use Tailwind CSS

### Manual Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/elysium-js.git
   cd elysium-js
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

Elysium-js follows a SvelteKit-inspired structure for organization and clarity:

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

## Core Concepts

### Routing

Elysium-js uses a file-based routing system similar to SvelteKit's app router. Routes are defined in the `app/routes` directory.

#### Page Routes

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

#### API Routes

API routes are defined in the `app/routes/api` directory:

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

### Layouts

Layouts provide a consistent structure for your pages. Create layouts in the `app/layouts` directory:

```tsx
// app/layouts/CustomLayout.tsx
import { PropsWithChildren } from 'hono/jsx';

export const CustomLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <head>
        <title>Custom Layout</title>
        {/* ... */}
      </head>
      <body>
        <header>
          {/* Custom header */}
        </header>
        
        <main>
          {children}
        </main>
        
        <footer>
          {/* Custom footer */}
        </footer>
      </body>
    </html>
  );
};
```

### Database Integration

Elysium-js supports multiple database options, with Turso as the default.

#### Turso (Default)

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

#### Models

Define your data models in the `app/models` directory:

```typescript
// app/models/example.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const examples = sqliteTable('examples', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString())
});

export type Example = typeof examples.$inferSelect;
export type NewExample = typeof examples.$inferInsert;
```

#### Migrations

Generate and run migrations with Drizzle:

```bash
# Generate migrations
bun run drizzle-kit generate

# Apply migrations (implementation depends on your setup)
bun run migrate
```

### HTMX Integration

Elysium-js uses HTMX for interactive UI without complex JavaScript:

```tsx
<button 
  hx-post="/api/examples" 
  hx-trigger="click"
  hx-target="#result"
  hx-swap="innerHTML"
>
  Create Example
</button>

<div id="result">
  <!-- Results will be displayed here -->
</div>
```

## Advanced Features

### Environment Variables

Create a `.env` file in the root of your project:

```
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

Load environment variables in your application:

```typescript
// src/index.ts
import { config } from 'dotenv';
config();

// Now you can access process.env.TURSO_DATABASE_URL
```

### Static Assets

Place static assets in the `static` directory. They will be served at the `/static` path:

```html
<link rel="stylesheet" href="/static/styles/main.css" />
<img src="/static/images/logo.png" alt="Logo" />
```

### Custom Components

Create reusable components in the `app/components` directory:

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

## Deployment

### Building for Production

```bash
bun run build
```

This creates a production build in the `dist` directory.

### Running in Production

```bash
bun run start
```

### Deploying to Hosting Platforms

#### Deploying to Fly.io

1. Install the Fly CLI
2. Create a `fly.toml` file:

```toml
app = "your-app-name"

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 3000
  force_https = true
```

3. Create a `Dockerfile`:

```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --production

COPY . .
RUN bun run build

ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "start"]
```

4. Deploy:

```bash
fly launch
```

## Customization

### Custom Server Configuration

Modify `src/index.ts` to customize server behavior:

```typescript
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { staticPlugin } from '@elysiajs/static';
import { cors } from '@elysiajs/cors';
import { setupRoutes } from '../app/routes';

const app = new Elysia()
  .use(html())
  .use(cors())
  .use(staticPlugin({
    assets: 'static',
    prefix: '/static'
  }))
  .use(setupRoutes)
  .listen(process.env.PORT || 3000);

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
```

### Custom Error Handling

Create a custom error handler:

```typescript
import { Elysia } from 'elysia';

const app = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return 'Not Found';
    }
    
    console.error(error);
    set.status = 500;
    return 'Internal Server Error';
  })
  // ... rest of your app
```

## Best Practices

### Code Organization

- Keep related files together in the same directory
- Use descriptive names for files and directories
- Split large components into smaller ones
- Use TypeScript interfaces for complex data structures

### Performance

- Use server-side rendering for initial page load
- Leverage HTMX for dynamic content updates
- Minimize JavaScript usage
- Use Turso's edge capabilities for global distribution

### Security

- Validate all user input
- Use parameterized queries for database operations
- Set appropriate CORS headers
- Don't expose sensitive information in client-side code

## Troubleshooting

### Common Issues

#### "Cannot find module"

Make sure the module is installed and the import path is correct.

```bash
bun install missing-package
```

#### Database Connection Issues

Check your database connection string and credentials.

#### HTMX Not Working

Make sure HTMX is properly loaded in your HTML:

```html
<script src="https://unpkg.com/htmx.org@1.9.6"></script>
```

## Contributing

We welcome contributions to Elysium-js! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Elysium-js is licensed under the MIT License.
