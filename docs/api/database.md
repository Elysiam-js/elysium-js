# Database API

<GlassyCard 
  title="Elysium-js Database API" 
  icon="🗄️"
  description="Documentation for the Elysium-js database API">

The database API provides utilities for interacting with databases in your Elysium-js application.

</GlassyCard>

## Overview

Elysium-js supports multiple database options, with Turso (SQLite for the edge) as the primary option. It also supports Prisma and Drizzle as alternative ORM options.

## Database Setup

### Turso

To set up Turso, first install the required dependencies:

```bash
bun add @libsql/client drizzle-orm
bun add -d drizzle-kit
```

Then create a database client:

```typescript
// app/db/index.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../models/schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
```

### Prisma

To set up Prisma, first install the required dependencies:

```bash
bun add @prisma/client
bun add -d prisma
```

Then initialize Prisma:

```bash
npx prisma init
```

Create your schema in `prisma/schema.prisma`:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

Generate the Prisma client:

```bash
npx prisma generate
```

Create a database client:

```typescript
// app/db/index.ts
import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();
```

### Drizzle

To set up Drizzle, first install the required dependencies:

```bash
bun add drizzle-orm pg
bun add -d drizzle-kit
```

Create your schema:

```typescript
// app/models/schema.ts
import { pgTable, serial, text, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name')
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  published: boolean('published').default(false),
  authorId: integer('author_id').references(() => users.id)
});
```

Create a database client:

```typescript
// app/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models/schema';

const connectionString = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/db';
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

## Database Operations

### Querying Data

#### Turso/Drizzle

```typescript
// Select all users
const users = await db.select().from(schema.users);

// Select a user by ID
const user = await db.select().from(schema.users).where(eq(schema.users.id, 1)).first();

// Select users with posts
const usersWithPosts = await db.select().from(schema.users).innerJoin(schema.posts, eq(schema.users.id, schema.posts.authorId));

// Select with conditions
const publishedPosts = await db.select().from(schema.posts).where(eq(schema.posts.published, true));

// Select with multiple conditions
const filteredPosts = await db.select().from(schema.posts).where(and(
  eq(schema.posts.published, true),
  like(schema.posts.title, '%search%')
));

// Select with pagination
const page = 1;
const pageSize = 10;
const paginatedPosts = await db.select().from(schema.posts).limit(pageSize).offset((page - 1) * pageSize);

// Select with ordering
const orderedPosts = await db.select().from(schema.posts).orderBy(schema.posts.createdAt, 'desc');

// Select with aggregation
const postCount = await db.select({ count: count() }).from(schema.posts).where(eq(schema.posts.published, true));
```

#### Prisma

```typescript
// Select all users
const users = await db.user.findMany();

// Select a user by ID
const user = await db.user.findUnique({
  where: { id: 1 }
});

// Select users with posts
const usersWithPosts = await db.user.findMany({
  include: { posts: true }
});

// Select with conditions
const publishedPosts = await db.post.findMany({
  where: { published: true }
});

// Select with multiple conditions
const filteredPosts = await db.post.findMany({
  where: {
    AND: [
      { published: true },
      { title: { contains: 'search' } }
    ]
  }
});

// Select with pagination
const page = 1;
const pageSize = 10;
const paginatedPosts = await db.post.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize
});

// Select with ordering
const orderedPosts = await db.post.findMany({
  orderBy: { createdAt: 'desc' }
});

// Select with aggregation
const postCount = await db.post.count({
  where: { published: true }
});
```

### Creating Data

#### Turso/Drizzle

```typescript
// Insert a user
const newUser = await db.insert(schema.users).values({
  email: 'user@example.com',
  name: 'User'
}).returning();

// Insert multiple users
const newUsers = await db.insert(schema.users).values([
  { email: 'user1@example.com', name: 'User 1' },
  { email: 'user2@example.com', name: 'User 2' }
]).returning();

// Insert a post
const newPost = await db.insert(schema.posts).values({
  title: 'New Post',
  content: 'Post content',
  published: true,
  authorId: 1
}).returning();
```

#### Prisma

```typescript
// Insert a user
const newUser = await db.user.create({
  data: {
    email: 'user@example.com',
    name: 'User'
  }
});

// Insert multiple users
const newUsers = await db.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' }
  ]
});

// Insert a post
const newPost = await db.post.create({
  data: {
    title: 'New Post',
    content: 'Post content',
    published: true,
    author: {
      connect: { id: 1 }
    }
  }
});

// Insert a user with posts
const newUserWithPosts = await db.user.create({
  data: {
    email: 'user@example.com',
    name: 'User',
    posts: {
      create: [
        { title: 'Post 1', content: 'Content 1' },
        { title: 'Post 2', content: 'Content 2' }
      ]
    }
  }
});
```

### Updating Data

#### Turso/Drizzle

```typescript
// Update a user
const updatedUser = await db.update(schema.users).set({
  name: 'Updated User'
}).where(eq(schema.users.id, 1)).returning();

// Update multiple users
const updatedUsers = await db.update(schema.users).set({
  name: 'Updated User'
}).where(in(schema.users.id, [1, 2, 3])).returning();

// Update with conditions
const updatedPosts = await db.update(schema.posts).set({
  published: true
}).where(eq(schema.posts.authorId, 1)).returning();
```

#### Prisma

```typescript
// Update a user
const updatedUser = await db.user.update({
  where: { id: 1 },
  data: {
    name: 'Updated User'
  }
});

// Update multiple users
const updatedUsers = await db.user.updateMany({
  where: { id: { in: [1, 2, 3] } },
  data: {
    name: 'Updated User'
  }
});

// Update with conditions
const updatedPosts = await db.post.updateMany({
  where: { authorId: 1 },
  data: {
    published: true
  }
});

// Update a user and their posts
const updatedUserWithPosts = await db.user.update({
  where: { id: 1 },
  data: {
    name: 'Updated User',
    posts: {
      updateMany: {
        where: { published: false },
        data: { published: true }
      }
    }
  }
});
```

### Deleting Data

#### Turso/Drizzle

```typescript
// Delete a user
const deletedUser = await db.delete(schema.users).where(eq(schema.users.id, 1)).returning();

// Delete multiple users
const deletedUsers = await db.delete(schema.users).where(in(schema.users.id, [1, 2, 3])).returning();

// Delete with conditions
const deletedPosts = await db.delete(schema.posts).where(eq(schema.posts.authorId, 1)).returning();
```

#### Prisma

```typescript
// Delete a user
const deletedUser = await db.user.delete({
  where: { id: 1 }
});

// Delete multiple users
const deletedUsers = await db.user.deleteMany({
  where: { id: { in: [1, 2, 3] } }
});

// Delete with conditions
const deletedPosts = await db.post.deleteMany({
  where: { authorId: 1 }
});

// Delete a user and their posts
const deletedUserWithPosts = await db.user.delete({
  where: { id: 1 },
  include: { posts: true }
});
```

## Transactions

### Turso/Drizzle

```typescript
// Transaction with Drizzle
const result = await db.transaction(async (tx) => {
  const user = await tx.insert(schema.users).values({
    email: 'user@example.com',
    name: 'User'
  }).returning();
  
  const post = await tx.insert(schema.posts).values({
    title: 'New Post',
    content: 'Post content',
    authorId: user[0].id
  }).returning();
  
  return { user: user[0], post: post[0] };
});
```

### Prisma

```typescript
// Transaction with Prisma
const result = await db.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: {
      email: 'user@example.com',
      name: 'User'
    }
  });
  
  const post = await tx.post.create({
    data: {
      title: 'New Post',
      content: 'Post content',
      authorId: user.id
    }
  });
  
  return { user, post };
});
```

## Migrations

### Turso/Drizzle

Create a `drizzle.config.ts` file:

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './app/models/schema.ts',
  out: './app/db/migrations',
  driver: 'libsql',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || 'file:./data.db'
  }
} satisfies Config;
```

Generate migrations:

```bash
npx drizzle-kit generate
```

Apply migrations:

```typescript
// app/db/migrate.ts
import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './index';

async function runMigrations() {
  console.log('Running migrations...');
  
  await migrate(db, { migrationsFolder: './app/db/migrations' });
  
  console.log('Migrations completed');
}

runMigrations().catch(console.error);
```

### Prisma

Create migrations:

```bash
npx prisma migrate dev --name init
```

Apply migrations:

```bash
npx prisma migrate deploy
```

## Examples

### User Authentication

```typescript
// app/routes/api/auth.ts
import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { users } from '../../models/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '../../utils/password';
import { generateToken } from '../../utils/auth';

export const authRoutes = new Elysia()
  .post('/api/register', async ({ body }) => {
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, body.email)).first();
    
    if (existingUser) {
      return { error: 'User already exists' };
    }
    
    // Hash password
    const hashedPassword = await hashPassword(body.password);
    
    // Create user
    const newUser = await db.insert(users).values({
      email: body.email,
      name: body.name,
      password: hashedPassword
    }).returning();
    
    // Generate token
    const token = generateToken(newUser[0]);
    
    return { user: newUser[0], token };
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8 }),
      name: t.String()
    })
  })
  .post('/api/login', async ({ body }) => {
    // Find user
    const user = await db.select().from(users).where(eq(users.email, body.email)).first();
    
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    
    // Verify password
    const isValid = await verifyPassword(body.password, user.password);
    
    if (!isValid) {
      return { error: 'Invalid credentials' };
    }
    
    // Generate token
    const token = generateToken(user);
    
    return { user, token };
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String()
    })
  });
```

### Todo List API

```typescript
// app/routes/api/todos.ts
import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { todos } from '../../models/schema';
import { eq } from 'drizzle-orm';
import { auth } from '../../middleware/auth';

export const todoRoutes = new Elysia()
  .use(auth)
  .get('/api/todos', async ({ isAuthenticated, user, set }) => {
    if (!isAuthenticated) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
    
    return await db.select().from(todos).where(eq(todos.userId, user.id));
  })
  .get('/api/todos/:id', async ({ isAuthenticated, user, params, set }) => {
    if (!isAuthenticated) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
    
    const todo = await db.select().from(todos).where(eq(todos.id, params.id)).first();
    
    if (!todo) {
      set.status = 404;
      return { error: 'Todo not found' };
    }
    
    if (todo.userId !== user.id) {
      set.status = 403;
      return { error: 'Forbidden' };
    }
    
    return todo;
  })
  .post('/api/todos', async ({ isAuthenticated, user, body, set }) => {
    if (!isAuthenticated) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
    
    return await db.insert(todos).values({
      ...body,
      userId: user.id
    }).returning();
  }, {
    body: t.Object({
      title: t.String(),
      completed: t.Boolean({ default: false })
    })
  })
  .put('/api/todos/:id', async ({ isAuthenticated, user, params, body, set }) => {
    if (!isAuthenticated) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
    
    const todo = await db.select().from(todos).where(eq(todos.id, params.id)).first();
    
    if (!todo) {
      set.status = 404;
      return { error: 'Todo not found' };
    }
    
    if (todo.userId !== user.id) {
      set.status = 403;
      return { error: 'Forbidden' };
    }
    
    return await db.update(todos).set(body).where(eq(todos.id, params.id)).returning();
  }, {
    body: t.Object({
      title: t.Optional(t.String()),
      completed: t.Optional(t.Boolean())
    })
  })
  .delete('/api/todos/:id', async ({ isAuthenticated, user, params, set }) => {
    if (!isAuthenticated) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
    
    const todo = await db.select().from(todos).where(eq(todos.id, params.id)).first();
    
    if (!todo) {
      set.status = 404;
      return { error: 'Todo not found' };
    }
    
    if (todo.userId !== user.id) {
      set.status = 403;
      return { error: 'Forbidden' };
    }
    
    return await db.delete(todos).where(eq(todos.id, params.id)).returning();
  });
```

## Best Practices

- Use environment variables for database credentials
- Use migrations for database schema changes
- Use transactions for operations that need to be atomic
- Use prepared statements to prevent SQL injection
- Use connection pooling for better performance
- Add indexes to frequently queried columns
- Use pagination for large result sets
- Add validation to database operations
- Add error handling for database operations
- Use a consistent naming convention for database objects
