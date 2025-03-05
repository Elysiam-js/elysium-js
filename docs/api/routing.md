# Routing API

<GlassyCard 
  title="Elysium-js Routing API" 
  icon="🛣️"
  description="Documentation for the Elysium-js routing API">

The routing API provides utilities for defining routes in your Elysium-js application.

</GlassyCard>

## Overview

Elysium-js uses Elysia's routing system, with some additional conventions and utilities to make routing easier and more organized.

## Route Definition

Routes in Elysium-js are defined using Elysia's routing API:

```typescript
// app/routes/index.ts
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { BaseLayout } from '../layouts/BaseLayout';
import { HomePage } from '../components/HomePage';

export const routes = new Elysia()
  .use(html())
  .get('/', ({ html }) => html(
    <BaseLayout>
      <HomePage />
    </BaseLayout>
  ));
```

## Route Parameters

You can define route parameters using the `:param` syntax:

```typescript
// app/routes/users.ts
import { Elysia } from 'elysia';

export const userRoutes = new Elysia()
  .get('/users/:id', ({ params }) => {
    return { id: params.id };
  });
```

## Route Handlers

Route handlers are functions that process requests and return responses:

```typescript
// app/routes/api/users.ts
import { Elysia } from 'elysia';
import { db } from '../../db';
import { users } from '../../models/schema';

export const userApiRoutes = new Elysia()
  .get('/api/users', async () => {
    return await db.select().from(users);
  })
  .get('/api/users/:id', async ({ params }) => {
    return await db.select().from(users).where(eq(users.id, params.id)).first();
  })
  .post('/api/users', async ({ body }) => {
    return await db.insert(users).values(body);
  })
  .put('/api/users/:id', async ({ params, body }) => {
    return await db.update(users).set(body).where(eq(users.id, params.id));
  })
  .delete('/api/users/:id', async ({ params }) => {
    return await db.delete(users).where(eq(users.id, params.id));
  });
```

## Route Groups

You can group routes using the `group` method:

```typescript
// app/routes/api/index.ts
import { Elysia } from 'elysia';
import { userApiRoutes } from './users';
import { postApiRoutes } from './posts';

export const apiRoutes = new Elysia()
  .group('/api', app => app
    .use(userApiRoutes)
    .use(postApiRoutes)
  );
```

## Route Middleware

You can add middleware to routes:

```typescript
// app/routes/api/protected.ts
import { Elysia } from 'elysia';
import { auth } from '../../middleware/auth';

export const protectedRoutes = new Elysia()
  .use(auth)
  .get('/api/protected', ({ isAuthenticated, user, set }) => {
    if (!isAuthenticated) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
    
    return {
      message: 'This is a protected route',
      user
    };
  });
```

## Route Guards

You can add guards to routes to protect them:

```typescript
// app/routes/api/admin.ts
import { Elysia } from 'elysia';
import { auth } from '../../middleware/auth';

export const adminRoutes = new Elysia()
  .use(auth)
  .guard({
    beforeHandle: ({ isAuthenticated, user, set }) => {
      if (!isAuthenticated) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }
      
      if (user.role !== 'admin') {
        set.status = 403;
        return { error: 'Forbidden' };
      }
    }
  })
  .get('/api/admin', () => {
    return { message: 'This is an admin route' };
  });
```

## Route Validation

You can add validation to routes:

```typescript
// app/routes/api/users.ts
import { Elysia, t } from 'elysia';

export const userRoutes = new Elysia()
  .post('/api/users', ({ body }) => {
    return { user: body };
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
      age: t.Number({ minimum: 18 })
    })
  });
```

## Route Responses

You can customize route responses:

```typescript
// app/routes/api/users.ts
import { Elysia } from 'elysia';

export const userRoutes = new Elysia()
  .get('/api/users/:id', ({ params, set }) => {
    // Set status code
    set.status = 200;
    
    // Set headers
    set.headers['X-Custom-Header'] = 'Custom Value';
    
    // Set cookies
    set.cookie('user_id', params.id, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 // 1 day
    });
    
    return { id: params.id };
  });
```

## HTML Responses

You can return HTML responses using the `html` plugin:

```typescript
// app/routes/index.ts
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { BaseLayout } from '../layouts/BaseLayout';
import { HomePage } from '../components/HomePage';

export const routes = new Elysia()
  .use(html())
  .get('/', ({ html }) => html(
    <BaseLayout>
      <HomePage />
    </BaseLayout>
  ));
```

## File Responses

You can return file responses:

```typescript
// app/routes/files.ts
import { Elysia } from 'elysia';
import { Bun } from 'bun';

export const fileRoutes = new Elysia()
  .get('/files/:filename', async ({ params, set }) => {
    const file = Bun.file(`files/${params.filename}`);
    
    if (!await file.exists()) {
      set.status = 404;
      return { error: 'File not found' };
    }
    
    set.headers['Content-Type'] = file.type;
    set.headers['Content-Disposition'] = `attachment; filename="${params.filename}"`;
    
    return file;
  });
```

## Redirect Responses

You can return redirect responses:

```typescript
// app/routes/redirect.ts
import { Elysia } from 'elysia';

export const redirectRoutes = new Elysia()
  .get('/redirect', ({ set }) => {
    set.redirect = '/destination';
  });
```

## Error Responses

You can return error responses:

```typescript
// app/routes/error.ts
import { Elysia } from 'elysia';

export const errorRoutes = new Elysia()
  .get('/error', ({ set }) => {
    set.status = 500;
    return { error: 'Internal Server Error' };
  });
```

## WebSocket Routes

You can define WebSocket routes:

```typescript
// app/routes/ws.ts
import { Elysia } from 'elysia';
import { websocket } from '@elysiajs/websocket';

export const wsRoutes = new Elysia()
  .use(websocket())
  .ws('/ws', {
    message(ws, message) {
      ws.send(`Echo: ${message}`);
    }
  });
```

## Route Organization

Elysium-js follows a convention for organizing routes:

```
app/routes/
├── index.ts           # Main routes
├── api/               # API routes
│   ├── index.ts       # API route index
│   ├── users.ts       # User API routes
│   └── posts.ts       # Post API routes
├── auth/              # Authentication routes
│   ├── index.ts       # Auth route index
│   ├── login.ts       # Login routes
│   └── register.ts    # Registration routes
└── ...
```

## Route Composition

You can compose routes from multiple files:

```typescript
// app/routes/index.ts
import { Elysia } from 'elysia';
import { apiRoutes } from './api';
import { authRoutes } from './auth';
import { staticRoutes } from './static';

export const routes = new Elysia()
  .use(apiRoutes)
  .use(authRoutes)
  .use(staticRoutes);
```

## Examples

### Basic Routes

```typescript
// app/routes/index.ts
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { BaseLayout } from '../layouts/BaseLayout';
import { HomePage } from '../components/HomePage';
import { AboutPage } from '../components/AboutPage';

export const routes = new Elysia()
  .use(html())
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
```

### API Routes

```typescript
// app/routes/api/users.ts
import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { users } from '../../models/schema';
import { eq } from 'drizzle-orm';

export const userApiRoutes = new Elysia()
  .get('/api/users', async () => {
    return await db.select().from(users);
  })
  .get('/api/users/:id', async ({ params }) => {
    return await db.select().from(users).where(eq(users.id, params.id)).first();
  })
  .post('/api/users', async ({ body }) => {
    return await db.insert(users).values(body);
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
      age: t.Number({ minimum: 18 })
    })
  })
  .put('/api/users/:id', async ({ params, body }) => {
    return await db.update(users).set(body).where(eq(users.id, params.id));
  })
  .delete('/api/users/:id', async ({ params }) => {
    return await db.delete(users).where(eq(users.id, params.id));
  });
```

### Protected Routes

```typescript
// app/routes/api/protected.ts
import { Elysia } from 'elysia';
import { auth } from '../../middleware/auth';

export const protectedRoutes = new Elysia()
  .use(auth)
  .get('/api/protected', ({ isAuthenticated, user, set }) => {
    if (!isAuthenticated) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
    
    return {
      message: 'This is a protected route',
      user
    };
  });
```

## Best Practices

- Organize routes by feature or resource
- Use route groups for related routes
- Add validation to routes
- Use middleware for cross-cutting concerns
- Keep route handlers small and focused
- Use descriptive route names
- Document your API with Swagger
- Add error handling to routes
- Use route guards for protected routes
- Test your routes with unit tests
