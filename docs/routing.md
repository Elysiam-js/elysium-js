# Routing in Elysium.js

Elysium.js uses a file-based routing system inspired by Next.js and SvelteKit, making it easy to organize your application's routes.

## File-Based Routing

Routes in Elysium.js are defined by the files in your `app/routes` directory. The file structure directly maps to your URL paths:

```
app/routes/
├── +page.els              # Route: /
├── about/
│   └── +page.els          # Route: /about
├── blog/
│   ├── +page.els          # Route: /blog
│   └── [slug]/
│       └── +page.els      # Route: /blog/:slug
└── api/
    ├── users/
    │   ├── +server.ts     # API Route: /api/users
    │   └── [id]/
    │       └── +server.ts # API Route: /api/users/:id
    └── +server.ts         # API Route: /api
```

## Page Routes

Page routes are defined by `+page.els` files. These files contain components that render the UI for a specific route.

### Basic Page

```typescript
// app/routes/about/+page.els
<script>
  import { onMount } from 'elysium-js';
  
  onMount(() => {
    console.log('About page mounted');
  });
</script>

<div>
  <h1>About Us</h1>
  <p>This is the about page.</p>
</div>
```

## Dynamic Routes

Dynamic routes are defined by placing square brackets around a directory name. The value inside the brackets becomes a parameter in your route.

### Dynamic Route Example

```typescript
// app/routes/blog/[slug]/+page.els
<script>
  // The slug parameter is available in the params object
  const { params } = props;
  const { slug } = params;
  
  // You can use the slug to fetch data
  const [post, setPost] = useState(null);
  
  onMount(async () => {
    const response = await fetch(`/api/posts/${slug}`);
    const data = await response.json();
    setPost(data);
  });
</script>

<div>
  {#if post}
    <h1>{post.title}</h1>
    <div>{post.content}</div>
  {:else}
    <p>Loading...</p>
  {/if}
</div>
```

## API Routes

API routes are defined by `+server.ts` files. These files export a default function that configures an Elysia instance for the route.

### Basic API Route

```typescript
// app/routes/api/users/+server.ts
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app
    .get('/', ({ success }) => {
      const users = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
      ];
      
      return success(users, 'Users retrieved successfully');
    })
    .post('/', ({ body, created }) => {
      // Create a new user
      const newUser = { id: 3, name: body.name };
      
      return created(newUser, 'User created successfully');
    });
```

### Dynamic API Route

```typescript
// app/routes/api/users/[id]/+server.ts
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app
    .get('/', ({ params, success, error }) => {
      // Get the user ID from the params
      const { id } = params;
      
      // Find the user (example)
      const user = findUser(id);
      
      if (!user) {
        throw error.NotFound(`User with ID ${id} not found`);
      }
      
      return success(user, 'User retrieved successfully');
    })
    .put('/', ({ params, body, success, error }) => {
      // Update user logic
      const { id } = params;
      
      // Update the user (example)
      const updatedUser = updateUser(id, body);
      
      if (!updatedUser) {
        throw error.NotFound(`User with ID ${id} not found`);
      }
      
      return success(updatedUser, 'User updated successfully');
    })
    .delete('/', ({ params, noContent, error }) => {
      // Delete user logic
      const { id } = params;
      
      // Delete the user (example)
      const deleted = deleteUser(id);
      
      if (!deleted) {
        throw error.NotFound(`User with ID ${id} not found`);
      }
      
      return noContent();
    });
```

## Layouts

Layouts allow you to share UI elements across multiple routes. They are defined by `+layout.els` files.

```typescript
// app/routes/+layout.els
<script>
  // The children prop contains the child route component
  const { children } = props;
</script>

<div class="layout">
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/blog">Blog</a>
    </nav>
  </header>
  
  <main>
    {children}
  </main>
  
  <footer>
    <p>© 2025 Elysium.js</p>
  </footer>
</div>
```

## Server Data Loading

You can load data on the server for your pages using `+page.server.ts` files:

```typescript
// app/routes/blog/+page.server.ts
export async function load() {
  // Fetch data from a database or API
  const posts = await fetchPosts();
  
  // Return the data to be passed to the page component
  return {
    posts
  };
}
```

Then use the data in your page component:

```typescript
// app/routes/blog/+page.els
<script>
  // The data from the load function is available in the data prop
  const { data } = props;
  const { posts } = data;
</script>

<div>
  <h1>Blog Posts</h1>
  
  {#if posts.length > 0}
    <ul>
      {#each posts as post}
        <li>
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No posts found.</p>
  {/if}
</div>
```

## Route Groups

Route groups allow you to organize your routes without affecting the URL structure. Create a directory with parentheses to define a route group:

```
app/routes/
├── (auth)/
│   ├── login/
│   │   └── +page.els      # Route: /login
│   └── register/
│       └── +page.els      # Route: /register
└── (dashboard)/
    ├── profile/
    │   └── +page.els      # Route: /profile
    └── settings/
        └── +page.els      # Route: /settings
```

## Catch-All Routes

Catch-all routes can match multiple URL segments. Create a directory with three dots followed by a name:

```
app/routes/
└── docs/
    └── [...slug]/
        └── +page.els      # Matches: /docs/any/path/here
```

Access the segments in your component:

```typescript
// app/routes/docs/[...slug]/+page.els
<script>
  const { params } = props;
  const { slug } = params; // Array of segments, e.g. ['any', 'path', 'here']
  
  // Join the segments to get the full path
  const fullPath = slug.join('/');
</script>

<div>
  <h1>Documentation</h1>
  <p>Path: {fullPath}</p>
</div>
```

## Optional Catch-All Routes

Optional catch-all routes are similar to catch-all routes, but they also match the parent path:

```
app/routes/
└── docs/
    └── [[...slug]]/
        └── +page.els      # Matches: /docs and /docs/any/path/here
```

## Error Handling

You can create error boundaries for your routes using `+error.els` files:

```typescript
// app/routes/+error.els
<script>
  const { error } = props;
</script>

<div class="error-container">
  <h1>Error</h1>
  <p>{error.message}</p>
  <button onclick={() => window.location.reload()}>
    Try again
  </button>
</div>
```

## Loading States

Define loading states for your routes using `+loading.els` files:

```typescript
// app/routes/blog/+loading.els
<div class="loading-container">
  <div class="spinner"></div>
  <p>Loading blog posts...</p>
</div>
```

## Middleware

You can add middleware to specific routes or route groups:

```typescript
// app/routes/api/+middleware.ts
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.use((app) =>
    app.derive(({ request }) => {
      // Check for API key
      const apiKey = request.headers.get('x-api-key');
      
      if (!apiKey || apiKey !== process.env.API_KEY) {
        throw error.Unauthorized('Invalid API key');
      }
      
      return {};
    })
  );
```

This middleware will be applied to all routes under the `/api` path.
