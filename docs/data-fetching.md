# Data Fetching in Elysium.js

Elysium.js provides several ways to fetch data for your application, both on the server and client sides.

## Server-Side Data Fetching

### Using Server Files

Server files with the `.server.ts` extension are used for server-side data fetching:

- `+page.server.ts`: For fetching data for a specific page
- `+layout.server.ts`: For fetching data for a layout that's shared across multiple pages

#### Page Server Example

```typescript
// app/routes/users/+page.server.ts
import { db } from '../../lib/db';

export async function load() {
  try {
    const users = await db.user.findMany();
    
    return {
      users
    };
  } catch (error) {
    console.error('Error loading users:', error);
    return {
      users: [],
      error: 'Failed to load users'
    };
  }
}
```

#### Layout Server Example

```typescript
// app/routes/+layout.server.ts
import { db } from '../lib/db';

export async function load() {
  try {
    const categories = await db.category.findMany();
    const user = await getCurrentUser();
    
    return {
      categories,
      user
    };
  } catch (error) {
    console.error('Error loading layout data:', error);
    return {
      categories: [],
      user: null,
      error: 'Failed to load layout data'
    };
  }
}
```

### Accessing Server Data in Components

Data loaded in server files is automatically available in the corresponding page or layout component:

```html
<!-- app/routes/users/+page.els -->
<script>
  // Data from +page.server.ts is available as props
  export let users = [];
  export let error;
</script>

{#if error}
  <div class="error">{error}</div>
{:else}
  <h1>Users</h1>
  
  {#each users as user}
    <div class="user-card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  {/each}
{/if}
```

### Using the HTTP Client

Elysium.js includes a built-in HTTP client based on Axios for making external API requests:

```typescript
// app/routes/weather/+page.server.ts
import { http } from 'elysium-js';

export async function load() {
  try {
    const response = await http.get('https://api.weather.com/forecast', {
      params: {
        city: 'New York',
        units: 'metric'
      }
    });
    
    return {
      forecast: response.data
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return {
      forecast: null,
      error: 'Failed to fetch weather data'
    };
  }
}
```

### Using Database ORM

Elysium.js provides integration with popular ORMs:

#### Turso Example

```typescript
// app/routes/posts/+page.server.ts
export async function load({ db }) {
  try {
    const result = await db.execute(`
      SELECT * FROM posts
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    return {
      posts: result.rows
    };
  } catch (error) {
    console.error('Error loading posts:', error);
    return {
      posts: [],
      error: 'Failed to load posts'
    };
  }
}
```

#### Prisma Example

```typescript
// app/routes/posts/[id]/+page.server.ts
export async function load({ params, db, error }) {
  try {
    const post = await db.post.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        author: true,
        comments: {
          include: {
            author: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!post) {
      throw error.NotFound(`Post with ID ${params.id} not found`);
    }
    
    return {
      post
    };
  } catch (error) {
    if (error.statusCode === 404) {
      throw error;
    }
    
    console.error('Error loading post:', error);
    return {
      post: null,
      error: 'Failed to load post'
    };
  }
}
```

#### Drizzle Example

```typescript
// app/routes/posts/+page.server.ts
import { desc } from 'drizzle-orm';
import { posts } from '../../db/schema';

export async function load({ db }) {
  try {
    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(10);
    
    return {
      posts: allPosts
    };
  } catch (error) {
    console.error('Error loading posts:', error);
    return {
      posts: [],
      error: 'Failed to load posts'
    };
  }
}
```

## Client-Side Data Fetching

### Using HTMX

HTMX is the recommended way to fetch data on the client side in Elysium.js:

```html
<!-- app/routes/dashboard/+page.els -->
<script>
  import { onMount } from 'elysium';
  
  onMount(() => {
    console.log('Dashboard mounted');
  });
</script>

<h1>Dashboard</h1>

<div class="stats-container">
  <div id="stats">
    <p>Loading statistics...</p>
  </div>
  
  <button
    hx-get="/api/stats"
    hx-target="#stats"
    hx-trigger="load, click"
    hx-swap="innerHTML"
  >
    Refresh Stats
  </button>
</div>

<div class="chart-container">
  <select
    hx-get="/api/chart"
    hx-target="#chart"
    hx-trigger="change"
    hx-include="this"
    name="period"
  >
    <option value="day">Today</option>
    <option value="week">This Week</option>
    <option value="month">This Month</option>
  </select>
  
  <div id="chart">
    <p>Select a period to view the chart</p>
  </div>
</div>
```

### API Endpoint for HTMX

```typescript
// app/routes/api/stats/+server.ts
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.get('/', async ({ html }) => {
    // Fetch data from database or external API
    const stats = await fetchStats();
    
    // Return HTML fragment for HTMX
    return html`
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Users</h3>
          <p class="stat-value">${stats.users}</p>
        </div>
        <div class="stat-card">
          <h3>Orders</h3>
          <p class="stat-value">${stats.orders}</p>
        </div>
        <div class="stat-card">
          <h3>Revenue</h3>
          <p class="stat-value">$${stats.revenue.toFixed(2)}</p>
        </div>
      </div>
    `;
  });
```

### Using Fetch API

For more complex client-side data fetching, you can use the Fetch API:

```html
<!-- app/routes/search/+page.els -->
<script>
  import { useState } from 'elysium';
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  async function handleSearch() {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }
</script>

<div class="search-container">
  <div class="search-form">
    <input
      type="text"
      placeholder="Search..."
      value="{query}"
      onchange="setQuery(event.target.value)"
    >
    <button onclick="handleSearch()" disabled="{loading}">
      {loading ? 'Searching...' : 'Search'}
    </button>
  </div>
  
  {#if error}
    <div class="error">{error}</div>
  {/if}
  
  {#if loading}
    <div class="loading">Searching...</div>
  {:else if results.length > 0}
    <div class="results">
      {#each results as result}
        <div class="result-item">
          <h3>{result.title}</h3>
          <p>{result.description}</p>
        </div>
      {/each}
    </div>
  {:else if query}
    <div class="no-results">No results found</div>
  {/if}
</div>
```

## Combining Server and Client Data Fetching

For the best user experience, you can combine server-side and client-side data fetching:

1. Load initial data on the server
2. Update or fetch additional data on the client

```html
<!-- app/routes/products/+page.els -->
<script>
  import { useState } from 'elysium';
  
  // Initial data from server
  export let products = [];
  export let categories = [];
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  function handleCategoryChange(category) {
    setSelectedCategory(category);
    
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  }
</script>

<h1>Products</h1>

<div class="filters">
  <button
    class="{selectedCategory === 'all' ? 'active' : ''}"
    onclick="handleCategoryChange('all')"
  >
    All
  </button>
  
  {#each categories as category}
    <button
      class="{selectedCategory === category.id ? 'active' : ''}"
      onclick="handleCategoryChange(category.id)"
    >
      {category.name}
    </button>
  {/each}
</div>

<div class="products-grid">
  {#each filteredProducts as product}
    <div class="product-card">
      <img src="{product.image}" alt="{product.name}">
      <h3>{product.name}</h3>
      <p class="price">${product.price.toFixed(2)}</p>
      <button
        hx-post="/api/cart/add"
        hx-include="closest .product-card"
        hx-target="#cart-count"
        hx-swap="innerHTML"
      >
        Add to Cart
      </button>
    </div>
  {/each}
</div>

<div class="load-more">
  <button
    hx-get="/api/products?page={page + 1}"
    hx-target=".products-grid"
    hx-swap="beforeend"
    hx-trigger="click"
  >
    Load More
  </button>
</div>
```

## Error Handling

### Server-Side Errors

For server-side data fetching, you can use the error handling system:

```typescript
// app/routes/products/[id]/+page.server.ts
export async function load({ params, db, error }) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id }
    });
    
    if (!product) {
      throw error.NotFound(`Product with ID ${params.id} not found`);
    }
    
    return {
      product
    };
  } catch (err) {
    // If it's an HTTP error (from error utility), rethrow it
    if (err.statusCode) {
      throw err;
    }
    
    // Otherwise, handle the error gracefully
    console.error('Error loading product:', err);
    return {
      product: null,
      error: 'Failed to load product'
    };
  }
}
```

### Client-Side Errors

For client-side data fetching, handle errors in your component:

```html
<script>
  async function fetchData() {
    try {
      setLoading(true);
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
</script>
```

## Best Practices

1. **Use Server-Side Fetching for Initial Load**: Fetch initial data on the server to improve SEO and initial load performance.
2. **Use HTMX for Dynamic Updates**: Use HTMX for client-side updates to minimize JavaScript.
3. **Handle Loading States**: Always show loading states to improve user experience.
4. **Handle Errors Gracefully**: Provide meaningful error messages to users.
5. **Cache Data When Appropriate**: Use caching to improve performance.
6. **Use TypeScript**: Define types for your data to improve type safety.
7. **Optimize Queries**: Only fetch the data you need to minimize payload size.
