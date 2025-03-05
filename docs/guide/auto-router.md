# Auto Router

Elysium-js includes a powerful auto-routing system that automatically maps your file structure to URL routes, similar to frameworks like Next.js and SvelteKit. This eliminates the need to manually define routes and simplifies your application structure.

## File-Based Routing Convention

The auto router follows a file-based routing convention similar to SvelteKit and Next.js App Router:

| File | Purpose |
|------|---------|
| `+page.els` | Page component for the route |
| `+page.server.ts` | Server-side data loading for the page |
| `+layout.els` | Layout component for the route and its children |
| `+layout.server.ts` | Server-side data loading for the layout |
| `+error.els` | Error boundary for the route and its children |
| `+loading.els` | Loading state for the route |
| `+server.ts` | API endpoint for the route |

## Directory Structure

Routes are defined by the directory structure in the `app/routes` directory:

```
app/routes/
├── +layout.els          # Root layout
├── +page.els            # Home page (/)
├── +page.server.ts      # Server data for home page
├── about/
│   └── +page.els        # About page (/about)
├── blog/
│   ├── +layout.els      # Blog layout
│   ├── +page.els        # Blog index (/blog)
│   └── [slug]/          # Dynamic route
│       ├── +page.els    # Blog post page (/blog/:slug)
│       └── +page.server.ts  # Server data for blog post
└── docs/
    └── [...slug]/       # Catch-all route
        ├── +page.els    # Docs page (/docs/:slug+)
        └── +page.server.ts  # Server data for docs
```

## Dynamic Routes

The auto router supports dynamic route parameters using the `[param]` syntax:

```tsx
// app/routes/users/[id]/+page.els
export default function UserPage({ params, data }) {
  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {params.id}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

This file will be accessible at `/users/:id`, where `:id` is a dynamic parameter.

## Catch-all Routes

For more complex routing needs, you can use the `[...slug]` syntax to create catch-all routes:

```tsx
// app/routes/docs/[...slug]/+page.els
export default function DocsPage({ params, data }) {
  // params.slug will be the full path after /docs/
  const slugParts = params.slug.split('/');
  
  return (
    <div>
      <h1>Documentation</h1>
      <p>Path: {params.slug}</p>
      <ul>
        {slugParts.map((part, i) => (
          <li key={i}>{part}</li>
        ))}
      </ul>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

This will match routes like:
- `/docs/getting-started`
- `/docs/guides/installation`
- `/docs/api/v1/endpoints/users`

## Server-Side Data Loading

Elysium-js supports server-side data loading with the `+page.server.ts` file:

```tsx
// app/routes/blog/[slug]/+page.server.ts
export async function load({ params }) {
  // Fetch data from a database or API
  const post = await db.posts.findUnique({
    where: { slug: params.slug }
  });
  
  return { post };
}

// app/routes/blog/[slug]/+page.els
export default function BlogPost({ data }) {
  const { post } = data;
  
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
```

The `load` function receives the route parameters, query parameters, and request object. The returned data is passed to your page component.

## Layouts

Layouts allow you to share UI elements across multiple pages. They're defined using the `+layout.els` file:

```tsx
// app/routes/+layout.els
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
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
          <p> 2025 My App</p>
        </footer>
      </body>
    </html>
  );
}
```

Layouts can also have their own data loading with `+layout.server.ts`:

```tsx
// app/routes/blog/+layout.server.ts
export async function load() {
  const categories = await db.categories.findMany();
  return { categories };
}

// app/routes/blog/+layout.els
export default function BlogLayout({ children, data }) {
  const { categories } = data;
  
  return (
    <div class="grid grid-cols-4">
      <aside class="col-span-1">
        <h2>Categories</h2>
        <ul>
          {categories.map(category => (
            <li>
              <a href={`/blog/category/${category.slug}`}>
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </aside>
      
      <main class="col-span-3">
        {children}
      </main>
    </div>
  );
}
```

## Error Handling

Error boundaries catch errors in your components and display a fallback UI. They're defined using the `+error.els` file:

```tsx
// app/routes/+error.els
export default function ErrorBoundary({ error, children }) {
  if (!error) return children;
  
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>
        Try again
      </button>
    </div>
  );
}
```

## Loading States

Loading states provide feedback to users while data is being loaded. They're defined using the `+loading.els` file:

```tsx
// app/routes/blog/+loading.els
export default function BlogLoading() {
  return (
    <div>
      <h1 class="animate-pulse bg-gray-200 h-8 w-1/2 mb-4"></h1>
      <div class="animate-pulse bg-gray-200 h-4 w-full mb-2"></div>
      <div class="animate-pulse bg-gray-200 h-4 w-full mb-2"></div>
      <div class="animate-pulse bg-gray-200 h-4 w-3/4 mb-2"></div>
    </div>
  );
}
```

## API Routes

API routes are defined using the `+server.ts` file:

```tsx
// app/routes/api/users/+server.ts
import { Elysia, t } from 'elysia';

export default new Elysia()
  .get('/', async () => {
    // Return all users
    return [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
  })
  .post('/', async ({ body }) => {
    // Create a new user
    return { id: 3, name: body.name };
  });
```

## Client-Side Interactivity

For interactive components, you can add client-side actions to your page components:

```tsx
// app/routes/counter/+page.els
export default function CounterPage() {
  return (
    <div>
      <h1>Counter</h1>
      <p>Count: <span class="count">0</span></p>
      <button data-action="increment">Increment</button>
      <button data-action="reset">Reset</button>
    </div>
  );
}

// Client-side actions
export const clientAction = {
  increment: (event, element) => {
    const countElement = document.querySelector('.count');
    const count = parseInt(countElement.textContent, 10);
    countElement.textContent = count + 1;
  },
  
  reset: (event, element) => {
    document.querySelector('.count').textContent = '0';
  }
};
```

## Benefits of File-Based Routing

- **Intuitive Structure**: File paths directly correspond to URL paths
- **Reduced Boilerplate**: No need to manually define routes
- **Colocated Code**: Keep related code together
- **Progressive Enhancement**: Start with SSR, add CSR as needed
- **Nested Layouts**: Share UI elements across multiple pages
- **Error Boundaries**: Handle errors gracefully
- **Loading States**: Provide feedback during data loading
- **Type Safety**: Full TypeScript support throughout

The file-based routing system in Elysium-js makes it easy to build complex applications with a clear and maintainable structure.
