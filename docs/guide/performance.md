# Performance Optimization

<GlassyCard 
  title="Optimizing Your Elysium-js Application" 
  icon="⚡"
  description="Learn techniques to improve the performance of your Elysium-js application">

Performance is a critical aspect of web applications. This guide covers various techniques to optimize your Elysium-js application for better speed and efficiency.

</GlassyCard>

## Server Performance

### Bun Runtime Optimization

Elysium-js leverages Bun, which is designed for performance. Here are some tips to get the most out of Bun:

#### Use Bun's Built-in Features

Bun includes built-in features that are faster than their Node.js equivalents:

```typescript
// Use Bun's built-in file system operations
const content = await Bun.file('path/to/file.txt').text();

// Use Bun's built-in HTTP client
const response = await Bun.fetch('https://api.example.com/data');
```

#### Optimize Startup Time

Bun has fast startup times, but you can optimize it further:

- Use the `--no-install` flag when running in production
- Use the `--smol` flag for smaller memory footprint (at the cost of some performance)

```bash
bun --no-install run start
```

### Elysia Optimization

Elysia is designed for performance, but there are ways to optimize it further:

#### Use the Right Plugins

Only use the plugins you need, as each plugin adds overhead:

```typescript
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { staticPlugin } from '@elysiajs/static';

// Only use the plugins you need
const app = new Elysia()
  .use(html())
  .use(staticPlugin({
    assets: 'static',
    prefix: '/'
  }))
  // ...
  .listen(3000);
```

#### Optimize Route Handlers

Keep your route handlers lean and efficient:

```typescript
// Good - Lean route handler
app.get('/users/:id', async ({ params }) => {
  return await getUserById(params.id);
});

// Bad - Doing too much in the route handler
app.get('/users/:id', async ({ params }) => {
  const user = await db.query('SELECT * FROM users WHERE id = ?', [params.id]);
  const posts = await db.query('SELECT * FROM posts WHERE user_id = ?', [params.id]);
  const comments = await db.query('SELECT * FROM comments WHERE user_id = ?', [params.id]);
  
  return {
    user,
    posts,
    comments
  };
});
```

#### Use Async/Await Properly

Use `Promise.all` for parallel operations:

```typescript
// Good - Parallel operations
app.get('/dashboard', async () => {
  const [users, posts, comments] = await Promise.all([
    getUsers(),
    getPosts(),
    getComments()
  ]);
  
  return {
    users,
    posts,
    comments
  };
});

// Bad - Sequential operations
app.get('/dashboard', async () => {
  const users = await getUsers();
  const posts = await getPosts();
  const comments = await getComments();
  
  return {
    users,
    posts,
    comments
  };
});
```

### Database Optimization

#### Connection Pooling

Use connection pooling to reuse database connections:

```typescript
// app/db/index.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../models/schema';

// Create a single client instance
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Export the database instance
export const db = drizzle(client, { schema });
```

#### Query Optimization

Optimize your database queries:

```typescript
// Good - Specific query
const user = await db.query('SELECT id, name, email FROM users WHERE id = ?', [id]);

// Bad - Fetching unnecessary data
const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
```

#### Use Indexes

Create indexes for frequently queried columns:

```sql
-- Create an index on the email column
CREATE INDEX idx_users_email ON users(email);
```

#### Batch Operations

Use batch operations for multiple inserts or updates:

```typescript
// Good - Batch insert
await db.batch([
  db.insert(users).values({ name: 'User 1', email: 'user1@example.com' }),
  db.insert(users).values({ name: 'User 2', email: 'user2@example.com' }),
  db.insert(users).values({ name: 'User 3', email: 'user3@example.com' })
]);

// Bad - Multiple inserts
await db.insert(users).values({ name: 'User 1', email: 'user1@example.com' });
await db.insert(users).values({ name: 'User 2', email: 'user2@example.com' });
await db.insert(users).values({ name: 'User 3', email: 'user3@example.com' });
```

## Frontend Performance

### HTMX Optimization

HTMX is designed to be lightweight, but there are ways to optimize it further:

#### Minimize DOM Updates

Use targeted DOM updates with HTMX:

```html
<!-- Good - Targeted update -->
<button hx-post="/api/counter/increment" hx-target="#count">Increment</button>
<span id="count">0</span>

<!-- Bad - Updating the entire container -->
<div id="counter-container">
  <button hx-post="/api/counter/increment" hx-target="#counter-container">Increment</button>
  <span>0</span>
</div>
```

#### Use Efficient Swap Methods

Choose the right swap method for your use case:

```html
<!-- Good - Only update the innerHTML -->
<button hx-post="/api/counter/increment" hx-target="#count" hx-swap="innerHTML">Increment</button>

<!-- Good - Append to a list -->
<button hx-post="/api/todos/create" hx-target="#todo-list" hx-swap="beforeend">Add Todo</button>

<!-- Good - Replace an entire element -->
<button hx-delete="/api/todos/1" hx-target="#todo-1" hx-swap="outerHTML">Delete</button>
```

#### Lazy Loading

Use lazy loading for content that's not immediately visible:

```html
<div hx-get="/api/comments" hx-trigger="revealed">
  <!-- Comments will be loaded when this div is scrolled into view -->
</div>
```

#### Debounce and Throttle

Use debounce and throttle for frequent events:

```html
<!-- Debounce search input -->
<input type="text" name="search" hx-get="/api/search" hx-trigger="keyup changed delay:500ms" hx-target="#search-results">

<!-- Throttle scroll events -->
<div hx-get="/api/more-content" hx-trigger="scroll throttle:500ms" hx-target="#content">
  <!-- Content will be loaded when scrolled, but not more than once every 500ms -->
</div>
```

### Asset Optimization

#### Minify CSS and JavaScript

Minify your CSS and JavaScript files:

```bash
# Install minifiers
bun add -D terser postcss-cli cssnano

# Minify JavaScript
terser static/js/main.js -o static/js/main.min.js

# Minify CSS
postcss static/css/styles.css -o static/css/styles.min.css -u cssnano
```

#### Optimize Images

Optimize your images for the web:

- Use modern formats like WebP and AVIF
- Compress images to reduce file size
- Use responsive images with `srcset`

```html
<picture>
  <source srcset="/images/hero.avif" type="image/avif">
  <source srcset="/images/hero.webp" type="image/webp">
  <img src="/images/hero.jpg" alt="Hero Image">
</picture>
```

#### Use a CDN

Use a Content Delivery Network (CDN) for static assets:

```html
<!-- Load HTMX from a CDN -->
<script src="https://unpkg.com/htmx.org@1.9.2"></script>

<!-- Load Tailwind CSS from a CDN -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
```

## Caching

### Server-Side Caching

Implement server-side caching for expensive operations:

```typescript
// Simple in-memory cache
const cache = new Map();

app.get('/api/expensive-operation', async () => {
  const cacheKey = 'expensive-operation';
  
  // Check if result is in cache
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  // Perform expensive operation
  const result = await performExpensiveOperation();
  
  // Cache the result
  cache.set(cacheKey, result);
  
  return result;
});
```

For more advanced caching, consider using a caching library or service like Redis.

### HTTP Caching

Use HTTP caching headers:

```typescript
app.get('/api/data', ({ set }) => {
  // Set cache headers
  set.headers['Cache-Control'] = 'public, max-age=3600'; // Cache for 1 hour
  
  return { data: 'This response will be cached' };
});
```

### Static Asset Caching

Set appropriate cache headers for static assets:

```typescript
.use(staticPlugin({
  assets: 'static',
  prefix: '/',
  maxAge: 31536000, // Cache for 1 year
  headers: {
    'Cache-Control': 'public, max-age=31536000, immutable'
  }
}))
```

## Load Testing and Monitoring

### Load Testing

Use tools like [k6](https://k6.io/) to load test your application:

```javascript
// load-test.js
import http from 'k6/http';
import { sleep } from 'k6';

export default function() {
  http.get('http://localhost:3000/');
  sleep(1);
}

export const options = {
  vus: 100, // 100 virtual users
  duration: '30s', // for 30 seconds
};
```

Run the load test:

```bash
k6 run load-test.js
```

### Monitoring

Implement monitoring to track your application's performance:

```typescript
// Simple request timing middleware
app.derive(({ request }) => {
  const start = performance.now();
  
  return {
    logRequest: () => {
      const duration = performance.now() - start;
      console.log(`${request.method} ${request.url} - ${duration.toFixed(2)}ms`);
    }
  };
});

app.onResponse(({ logRequest }) => {
  logRequest();
});
```

For production, consider using a monitoring service like [Datadog](https://www.datadoghq.com/), [New Relic](https://newrelic.com/), or [Sentry](https://sentry.io/).

## Code Splitting

### Component-Based Splitting

Split your code into smaller, reusable components:

```tsx
// Good - Small, focused components
function UserList({ users }) {
  return (
    <div>
      {users.map(user => <UserItem key={user.id} user={user} />)}
    </div>
  );
}

function UserItem({ user }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// Bad - Monolithic component
function Users({ users }) {
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### Route-Based Splitting

Split your code by route:

```typescript
// app/routes/index.ts
import { Elysia } from 'elysia';
import { userRoutes } from './users';
import { postRoutes } from './posts';
import { commentRoutes } from './comments';

export const routes = new Elysia()
  .use(userRoutes)
  .use(postRoutes)
  .use(commentRoutes);
```

## Best Practices

### Use Production Mode

Run your application in production mode:

```bash
NODE_ENV=production bun run start
```

### Optimize Dependencies

Keep your dependencies lean:

- Regularly audit your dependencies
- Remove unused dependencies
- Use lightweight alternatives when possible

### Profile Your Application

Use profiling tools to identify performance bottlenecks:

- Bun's built-in profiler
- Browser DevTools for frontend performance
- Database query analyzers

### Follow Performance Best Practices

- Minimize HTTP requests
- Reduce payload sizes
- Use efficient algorithms and data structures
- Implement pagination for large datasets
- Use appropriate data formats (JSON, HTML, etc.)

## Conclusion

Performance optimization is an ongoing process. By following these guidelines, you can create a fast and efficient Elysium-js application that provides a great user experience.
