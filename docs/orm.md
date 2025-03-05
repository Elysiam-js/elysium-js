# ORM Integration in Elysium.js

Elysium.js provides seamless integration with popular ORMs (Object-Relational Mappers) to simplify database interactions in your application.

## Supported ORMs

Elysium.js supports the following ORMs:

1. **Turso**: A SQLite database for the edge
2. **Prisma**: A next-generation ORM for Node.js and TypeScript
3. **Drizzle**: A lightweight TypeScript ORM with a focus on type safety

## Setup

You can configure an ORM when creating your Elysium application:

```typescript
import { createElysium } from 'elysium-js';

const app = createElysium({
  orm: {
    type: 'turso',
    config: {
      url: 'libsql://your-database.turso.io',
      authToken: 'your-auth-token'
    }
  }
});
```

## Turso Integration

[Turso](https://turso.tech/) is a distributed SQLite database built for the edge.

### Configuration

```typescript
import { createElysium } from 'elysium-js';

const app = createElysium({
  orm: {
    type: 'turso',
    config: {
      url: process.env.DATABASE_URL || 'file:./data.db',
      authToken: process.env.DATABASE_AUTH_TOKEN
    }
  }
});
```

### Usage

```typescript
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.get('/api/users', async ({ db, success }) => {
    // Execute a query
    const result = await db.execute('SELECT * FROM users');
    
    return success(result.rows, 'Users retrieved successfully');
  });
```

## Prisma Integration

[Prisma](https://www.prisma.io/) is a modern database toolkit that includes an ORM, migrations, and a query builder.

### Configuration

```typescript
import { createElysium } from 'elysium-js';

const app = createElysium({
  orm: {
    type: 'prisma',
    config: {
      // Prisma client options
      log: ['query', 'error']
    }
  }
});
```

### Usage

```typescript
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.group('/api/users', (app) =>
    app
      .get('/', async ({ db, success }) => {
        // Find all users
        const users = await db.user.findMany();
        
        return success(users, 'Users retrieved successfully');
      })
      .get('/:id', async ({ params, db, success, error }) => {
        // Find a user by ID
        const user = await db.user.findUnique({
          where: { id: parseInt(params.id) }
        });
        
        if (!user) {
          throw error.NotFound(`User with ID ${params.id} not found`);
        }
        
        return success(user, 'User retrieved successfully');
      })
      .post('/', async ({ body, db, created }) => {
        // Create a new user
        const user = await db.user.create({
          data: body
        });
        
        return created(user, 'User created successfully');
      })
  );
```

## Drizzle Integration

[Drizzle](https://orm.drizzle.team/) is a lightweight TypeScript ORM with a focus on type safety.

### Configuration

```typescript
import { createElysium } from 'elysium-js';

const app = createElysium({
  orm: {
    type: 'drizzle',
    config: {
      // SQLite (default)
      type: 'sqlite',
      url: 'file:./data.db'
      
      // Or PostgreSQL
      // type: 'postgres',
      // url: 'postgres://user:password@localhost:5432/db'
      
      // Or MySQL
      // type: 'mysql',
      // url: 'mysql://user:password@localhost:3306/db'
    }
  }
});
```

### Usage

```typescript
import { Elysia } from 'elysia';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';

export default (app: Elysia) =>
  app.group('/api/users', (app) =>
    app
      .get('/', async ({ db, success }) => {
        // Find all users
        const allUsers = await db.select().from(users);
        
        return success(allUsers, 'Users retrieved successfully');
      })
      .get('/:id', async ({ params, db, success, error }) => {
        // Find a user by ID
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, parseInt(params.id)))
          .limit(1);
        
        if (user.length === 0) {
          throw error.NotFound(`User with ID ${params.id} not found`);
        }
        
        return success(user[0], 'User retrieved successfully');
      })
      .post('/', async ({ body, db, created }) => {
        // Create a new user
        const newUser = await db
          .insert(users)
          .values(body)
          .returning();
        
        return created(newUser[0], 'User created successfully');
      })
  );
```

## Manual ORM Setup

You can also manually set up an ORM if you need more control:

```typescript
import { createElysium, setupTurso } from 'elysium-js';

// Create the app
const app = createElysium();

// Set up Turso
const tursoPlugin = await setupTurso({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

// Add the ORM to the app
app.use(tursoPlugin);
```

## Environment Variables

For security, it's recommended to store database connection details in environment variables:

```
# .env
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
```

Then access them in your configuration:

```typescript
import { createElysium } from 'elysium-js';
import { env } from 'elysium-js';

// Load environment variables
env.load();

const app = createElysium({
  orm: {
    type: 'turso',
    config: {
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN
    }
  }
});
```

## Best Practices

1. **Environment Variables**: Store connection strings and credentials in environment variables.
2. **Connection Pooling**: Use connection pooling for production applications.
3. **Migrations**: Use migrations to manage database schema changes.
4. **Type Safety**: Leverage TypeScript types for your database models.
5. **Query Optimization**: Monitor and optimize database queries for performance.
