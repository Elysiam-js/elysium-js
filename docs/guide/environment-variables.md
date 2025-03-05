# Environment Variables

Environment variables are a way to store configuration settings and sensitive information outside of your application code. This guide covers how to use environment variables in your Elysium-js application.

## Setting Up Environment Variables

### Creating a .env File

Create a `.env` file in the root of your project:

```
# Database
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Application
PORT=3000
NODE_ENV=development
```

### Loading Environment Variables

To load environment variables from your `.env` file, you can use the `dotenv` package:

```bash
bun add dotenv
```

Then, in your application entry point:

```typescript
// src/index.ts
import { config } from 'dotenv';
config();

// Now you can access process.env.TURSO_DATABASE_URL
```

## Accessing Environment Variables

You can access environment variables using `process.env`:

```typescript
const port = process.env.PORT || 3000;
const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
```

## Using Environment Variables in Your Application

### Database Configuration

```typescript
// app/db/index.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../models/todo';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
```

### Server Configuration

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

## Environment-Specific Configuration

You can use different environment variables for different environments (development, staging, production):

```typescript
// src/config.ts
const isDev = process.env.NODE_ENV === 'development';
const isStaging = process.env.NODE_ENV === 'staging';
const isProd = process.env.NODE_ENV === 'production';

export const config = {
  isDev,
  isStaging,
  isProd,
  database: {
    url: process.env.TURSO_DATABASE_URL || 'file:./data.db',
    authToken: process.env.TURSO_AUTH_TOKEN
  },
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  }
};
```

Then use this configuration in your application:

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { config } from './config';

const app = new Elysia()
  // ...
  .listen(config.server.port);

console.log(`Server running in ${config.isDev ? 'development' : 'production'} mode`);
console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
```

## Environment Variables in Different Environments

### Development

In development, you can use a `.env` file to store your environment variables.

### Production

In production, you should set environment variables using your hosting platform's tools.

#### Fly.io

```bash
fly secrets set TURSO_DATABASE_URL=libsql://your-database.turso.io
fly secrets set TURSO_AUTH_TOKEN=your-auth-token
```

#### Railway

Set environment variables in the Railway dashboard.

#### Vercel

Set environment variables in the Vercel dashboard or using the CLI:

```bash
vercel env add TURSO_DATABASE_URL
```

## Environment Variables in CI/CD

When using CI/CD, you can set environment variables in your CI/CD platform.

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - name: Install dependencies
        run: bun install
      - name: Build
        run: bun run build
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}
      - name: Deploy to Fly.io
        uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

## Type-Safe Environment Variables

You can use TypeScript to make your environment variables type-safe:

```typescript
// src/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().default('3000'),
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string().optional()
});

export const env = envSchema.parse(process.env);
```

Then use this in your application:

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { env } from './env';

const app = new Elysia()
  // ...
  .listen(parseInt(env.PORT));

console.log(`Server running in ${env.NODE_ENV} mode`);
console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
```

## Best Practices

- Never commit `.env` files to version control
- Use a `.env.example` file to document required environment variables
- Use different environment variables for different environments
- Validate environment variables at startup
- Use a library like `zod` to make environment variables type-safe
- Use a tool like `dotenv-vault` to securely share environment variables with your team
