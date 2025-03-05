# Elysium.js Plugins

Elysium.js comes with a variety of built-in plugins to enhance your application development experience.

## Core Plugins

### Swagger UI

Automatically generates API documentation from your Elysia routes.

```typescript
import { createElysium } from 'elysium-js';

const app = createElysium({
  swagger: true // Enabled by default
});
```

Access your API documentation at `/swagger` by default.

You can add detailed documentation to your routes:

```typescript
import { apiDoc } from 'elysium-js';

export default (app: Elysia) =>
  app.group('/api', (app) =>
    app.get('/users', 
      () => { /* handler */ },
      apiDoc({
        tags: ['Users'],
        summary: 'Get all users',
        description: 'Returns a list of all users in the system'
      })
    )
  );
```

### CORS Protection

Configure Cross-Origin Resource Sharing (CORS) for your application.

```typescript
import { setupCors } from 'elysium-js';

const app = createElysium({
  cors: true // Enabled by default
});

// Or with custom configuration
const app = createElysium();
setupCors(app, {
  origin: ['https://example.com', 'https://api.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
});
```

### HTTP Client

A built-in Axios-based HTTP client for making external requests.

```typescript
import { http, createHttpClient } from 'elysium-js';

// Using the default client
const data = await http.get('https://api.example.com/users');

// Creating a custom client
const customClient = createHttpClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer token'
  }
});

const response = await customClient.post('/users', { name: 'John Doe' });
```

### Environment Variables

Load and access environment variables in a type-safe way.

```typescript
import { env } from 'elysium-js';

// Load environment variables
env.load({
  path: '.env',
  environment: 'development',
  publicPrefix: 'PUBLIC_'
});

// Access environment variables
const port = env.getNumber('PORT', 3000);
const apiKey = env.get('API_KEY');
const isProduction = env.getBoolean('PRODUCTION', false);
```

Public variables (prefixed with `PUBLIC_`) are automatically available to the client.

### Logger

A structured logging system for your application.

```typescript
import { logger, LogLevel } from 'elysium-js';

// Configure the logger
logger.setLevel(LogLevel.DEBUG);

// Log messages
logger.debug('Debugging information');
logger.info('User logged in', { userId: 123 });
logger.warn('Rate limit approaching');
logger.error('Failed to connect to database', error);

// Create a child logger for a specific component
const authLogger = logger.child('auth');
authLogger.info('Authentication successful');
```

## Optional Plugins

These plugins can be enabled during project creation:

### WebSockets

Real-time communication with WebSockets.

```typescript
import { Elysia } from 'elysia';
import { websocket } from '@elysiajs/websocket';

export default (app: Elysia) =>
  app.use(websocket())
    .ws('/ws', {
      message(ws, message) {
        ws.send(`Echo: ${message}`);
      }
    });
```

### GraphQL

GraphQL API support.

```typescript
import { Elysia } from 'elysia';
import { graphql } from '@elysiajs/graphql';

export default (app: Elysia) =>
  app.use(graphql({
    schema: `
      type Query {
        hello: String
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'Hello World!'
      }
    }
  }));
```

### Task Scheduler

Schedule recurring tasks.

```typescript
import { createScheduler } from 'elysium-js';

const scheduler = createScheduler();

// Run a task every day at midnight
scheduler.schedule('0 0 * * *', () => {
  console.log('Running daily task');
});

// Run a task every 5 minutes
scheduler.schedule('*/5 * * * *', async () => {
  await cleanupExpiredSessions();
});
```

## Extending Elysium.js

You can create your own plugins by following this pattern:

```typescript
import { Elysia } from 'elysia';

export function myCustomPlugin(options = {}) {
  return (app: Elysia) => {
    // Configure the app with your plugin
    return app
      .state('myPlugin', { /* state */ })
      .derive({ /* context */ })
      .onRequest(({ /* request */ }) => {
        // Handle requests
      });
  };
}
```
