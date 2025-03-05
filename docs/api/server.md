# Server API

<GlassyCard 
  title="Elysium-js Server API" 
  icon="🖥️"
  description="Documentation for the Elysium-js server API">

The server API provides utilities for creating and configuring an Elysium-js server.

</GlassyCard>

## Overview

The Elysium-js server is built on top of the [Elysia](https://elysiajs.com/) framework and provides a set of utilities and conventions to make building full-stack applications easier.

## Creating a Server

To create an Elysium-js server, use the `createServer` function:

```typescript
// src/index.ts
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes,
  // Other options
});

app.listen(3000);
console.log('Server is running on http://localhost:3000');
```

## Server Options

The `createServer` function accepts an options object with the following properties:

| Property | Type | Description | Default |
| --- | --- | --- | --- |
| `routes` | `Elysia` | The routes to register with the server | Required |
| `plugins` | `Plugin[]` | An array of plugins to register with the server | `[]` |
| `middleware` | `Middleware[]` | An array of middleware to register with the server | `[]` |
| `staticDir` | `string` | The directory to serve static files from | `'static'` |
| `staticPrefix` | `string` | The URL prefix for static files | `'/'` |
| `cors` | `boolean \| CorsOptions` | CORS options | `false` |
| `compression` | `boolean \| CompressionOptions` | Compression options | `false` |
| `logger` | `boolean \| LoggerOptions` | Logger options | `false` |
| `swagger` | `boolean \| SwaggerOptions` | Swagger options | `false` |

## Plugins

Elysium-js supports plugins to extend the server's functionality. Plugins are registered using the `plugins` option:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';
import { authPlugin } from '../app/plugins/auth';
import { cachePlugin } from '../app/plugins/cache';

const app = createServer({
  routes,
  plugins: [
    authPlugin(),
    cachePlugin()
  ]
});
```

## Middleware

Elysium-js supports middleware to process requests and responses. Middleware is registered using the `middleware` option:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';
import { authMiddleware } from '../app/middleware/auth';
import { loggerMiddleware } from '../app/middleware/logger';

const app = createServer({
  routes,
  middleware: [
    authMiddleware,
    loggerMiddleware
  ]
});
```

## Static Files

Elysium-js can serve static files from a directory. By default, it serves files from the `static` directory with a URL prefix of `/`:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes,
  staticDir: 'public', // Serve files from the 'public' directory
  staticPrefix: '/assets' // Serve files with a URL prefix of '/assets'
});
```

## CORS

Elysium-js supports Cross-Origin Resource Sharing (CORS). CORS is disabled by default, but can be enabled with the `cors` option:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes,
  cors: true // Enable CORS with default options
});
```

You can also configure CORS with an options object:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes,
  cors: {
    origin: ['https://example.com'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Custom-Header'],
    credentials: true,
    maxAge: 86400
  }
});
```

## Compression

Elysium-js supports response compression. Compression is disabled by default, but can be enabled with the `compression` option:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes,
  compression: true // Enable compression with default options
});
```

You can also configure compression with an options object:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes,
  compression: {
    level: 6, // Compression level (0-9)
    threshold: 1024 // Minimum size (in bytes) for compression
  }
});
```

## Logger

Elysium-js supports request logging. Logging is disabled by default, but can be enabled with the `logger` option:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes,
  logger: true // Enable logging with default options
});
```

You can also configure logging with an options object:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes,
  logger: {
    level: 'info', // Log level
    format: 'json', // Log format
    timestamp: true // Include timestamp
  }
});
```

## Swagger

Elysium-js supports Swagger documentation. Swagger is disabled by default, but can be enabled with the `swagger` option:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes,
  swagger: true // Enable Swagger with default options
});
```

You can also configure Swagger with an options object:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes,
  swagger: {
    path: '/docs', // Path to Swagger UI
    spec: {
      info: {
        title: 'My API',
        version: '1.0.0'
      }
    }
  }
});
```

## Error Handling

Elysium-js provides error handling out of the box. You can customize error handling by adding an error handler:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes
});

app.onError(({ code, error, set }) => {
  console.error(`Error: ${code}`, error);
  
  set.status = code === 'NOT_FOUND' ? 404 : 500;
  return { error: 'Internal Server Error' };
});
```

## Lifecycle Hooks

Elysium-js provides lifecycle hooks for request processing:

```typescript
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes
});

// Before request
app.onRequest(({ request }) => {
  console.log(`Request: ${request.method} ${request.url}`);
});

// After request
app.onResponse(({ request, response }) => {
  console.log(`Response: ${request.method} ${request.url} ${response.status}`);
});

// Before route
app.onBeforeHandle(({ request }) => {
  console.log(`Before route: ${request.method} ${request.url}`);
});

// After route
app.onAfterHandle(({ request, response }) => {
  console.log(`After route: ${request.method} ${request.url} ${response.status}`);
});
```

## Examples

### Basic Server

```typescript
// src/index.ts
import { createServer } from 'elysium';
import { routes } from '../app/routes';

const app = createServer({
  routes
});

app.listen(3000);
console.log('Server is running on http://localhost:3000');
```

### Server with Options

```typescript
// src/index.ts
import { createServer } from 'elysium';
import { routes } from '../app/routes';
import { authPlugin } from '../app/plugins/auth';
import { loggerMiddleware } from '../app/middleware/logger';

const app = createServer({
  routes,
  plugins: [authPlugin()],
  middleware: [loggerMiddleware],
  staticDir: 'public',
  staticPrefix: '/assets',
  cors: true,
  compression: true,
  logger: true,
  swagger: true
});

app.listen(3000);
console.log('Server is running on http://localhost:3000');
```

## Best Practices

- Use environment variables for configuration
- Add error handling for production
- Use lifecycle hooks for logging and monitoring
- Use plugins and middleware to extend functionality
- Serve static files from a CDN in production
