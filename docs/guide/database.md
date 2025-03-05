# Database Integration

Elysium-js supports multiple database options, with Turso as the default. This guide will show you how to set up and use databases in your Elysium-js application.

## Turso (Default)

[Turso](https://turso.tech/) is a SQLite database for the edge. It's fast, reliable, and perfect for Elysium-js applications.

### Setup

First, make sure you have the Turso dependencies installed:

```bash
bun add @libsql/client drizzle-orm
bun add -d drizzle-kit
```

Then, create a database configuration file:

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

### Models

Define your data models in the `app/models` directory:

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

### Migrations

Set up a Drizzle configuration file:

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './app/models/*.ts',
  out: './drizzle',
  driver: 'libsql',
  dbCredentials: {
    url: 'file:./data.db',
    // For Turso cloud:
    // url: process.env.TURSO_DATABASE_URL,
    // authToken: process.env.TURSO_AUTH_TOKEN
  }
} satisfies Config;
```

Generate migrations:

```bash
bun run drizzle-kit generate
```

Create a migration script:

```typescript
// app/db/migrate.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

const client = createClient({
  url: 'file:./data.db',
  // For Turso cloud:
  // url: process.env.TURSO_DATABASE_URL,
  // authToken: process.env.TURSO_AUTH_TOKEN
});

const db = drizzle(client);

async function main() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations completed!');
  process.exit(0);
}

main().catch((e) => {
  console.error('Migration failed!');
  console.error(e);
  process.exit(1);
});
```

Add a script to your `package.json`:

```json
{
  "scripts": {
    "migrate": "bun run app/db/migrate.ts"
  }
}
```

Run migrations:

```bash
bun run migrate
```

### Usage

Now you can use your database in your routes:

```typescript
// app/routes/api/todos.ts
import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { todos } from '../../models/todo';
import { eq } from 'drizzle-orm';

export const todoRoutes = new Elysia({ prefix: '/todos' })
  .get('/', async () => {
    return await db.query.todos.findMany();
  })
  .get('/:id', async ({ params }) => {
    const todo = await db.query.todos.findFirst({
      where: eq(todos.id, parseInt(params.id))
    });
    
    if (!todo) {
      return new Response('Todo not found', { status: 404 });
    }
    
    return todo;
  })
  .post('/', async ({ body }) => {
    const [newTodo] = await db.insert(todos).values(body).returning();
    return newTodo;
  }, {
    body: t.Object({
      title: t.String(),
      completed: t.Optional(t.Boolean())
    })
  })
  .put('/:id', async ({ params, body }) => {
    const [updatedTodo] = await db
      .update(todos)
      .set(body)
      .where(eq(todos.id, parseInt(params.id)))
      .returning();
    
    if (!updatedTodo) {
      return new Response('Todo not found', { status: 404 });
    }
    
    return updatedTodo;
  }, {
    body: t.Object({
      title: t.Optional(t.String()),
      completed: t.Optional(t.Boolean())
    })
  })
  .delete('/:id', async ({ params }) => {
    await db
      .delete(todos)
      .where(eq(todos.id, parseInt(params.id)));
    
    return { success: true };
  });
```

## Prisma

[Prisma](https://www.prisma.io/) is a modern database toolkit that makes database access easy with an auto-generated query builder for TypeScript & Node.js.

### Setup

First, install Prisma:

```bash
bun add @prisma/client
bun add -d prisma
```

Initialize Prisma:

```bash
bunx prisma init
```

This will create a `prisma` directory with a `schema.prisma` file.

Edit the `schema.prisma` file:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

Create a `.env` file:

```
DATABASE_URL="file:./dev.db"
```

Generate the Prisma client:

```bash
bunx prisma generate
```

Create a database client:

```typescript
// app/db/index.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

### Usage

Use Prisma in your routes:

```typescript
// app/routes/api/todos.ts
import { Elysia, t } from 'elysia';
import { prisma } from '../../db';

export const todoRoutes = new Elysia({ prefix: '/todos' })
  .get('/', async () => {
    return await prisma.todo.findMany();
  })
  .get('/:id', async ({ params }) => {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(params.id) }
    });
    
    if (!todo) {
      return new Response('Todo not found', { status: 404 });
    }
    
    return todo;
  })
  .post('/', async ({ body }) => {
    const newTodo = await prisma.todo.create({
      data: body
    });
    return newTodo;
  }, {
    body: t.Object({
      title: t.String(),
      completed: t.Optional(t.Boolean())
    })
  })
  .put('/:id', async ({ params, body }) => {
    try {
      const updatedTodo = await prisma.todo.update({
        where: { id: parseInt(params.id) },
        data: body
      });
      return updatedTodo;
    } catch (error) {
      return new Response('Todo not found', { status: 404 });
    }
  }, {
    body: t.Object({
      title: t.Optional(t.String()),
      completed: t.Optional(t.Boolean())
    })
  })
  .delete('/:id', async ({ params }) => {
    try {
      await prisma.todo.delete({
        where: { id: parseInt(params.id) }
      });
      return { success: true };
    } catch (error) {
      return new Response('Todo not found', { status: 404 });
    }
  });
```

## Environment Variables

For production environments, you'll want to use environment variables for your database credentials.

Create a `.env` file:

```
# For Turso
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# For Prisma
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
```

Load environment variables in your application:

```typescript
// src/index.ts
import { config } from 'dotenv';
config();

// Now you can access process.env.TURSO_DATABASE_URL
```

Update your database configuration:

```typescript
// app/db/index.ts (Turso)
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../models/todo';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
```

## Best Practices

- **Use Migrations**: Always use migrations to manage your database schema
- **Validate Input**: Validate all user input before inserting it into your database
- **Use Transactions**: Use transactions for operations that require multiple database queries
- **Error Handling**: Implement proper error handling for database operations
- **Connection Pooling**: Use connection pooling for production environments
- **Security**: Never expose sensitive database credentials in your code
