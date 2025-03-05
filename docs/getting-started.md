# Getting Started with Elysium.js

Elysium.js is a modern full-stack framework built on Bun, Elysia, Turso, and HTMX. It provides a lightweight, ergonomic, and flexible development experience that can scale from small projects to enterprise applications.

## Installation

To create a new Elysium.js project, use the following command:

```bash
bun create elysium app
```

This will create a new directory called `app` with a basic Elysium.js project structure.

## Project Creation Options

During project creation, you'll be prompted to select various options:

### Database Options
- **ORM**: Choose between Turso, Prisma, or Drizzle
- **Auto Initialize**: Automatically set up the database schema

### Styling Options
- **Tailwind CSS**: Add Tailwind CSS for styling

### Code Quality Tools
- **Prettier**: Add Prettier for code formatting
- **ESLint**: Add ESLint for code linting

### API Features
- **WebSockets**: Add WebSockets support
- **GraphQL**: Add GraphQL API support
- **Cron**: Add task scheduling support
- **Swagger**: Add Swagger UI documentation
- **JWT Authentication**: Add JWT authentication support

## Project Structure

Elysium.js follows a SvelteKit-inspired project structure:

```
app/
├── node_modules/
├── public/            # Static assets
├── app/
│   ├── routes/        # Application routes
│   │   ├── +page.els  # Home page component
│   │   ├── +layout.els # Layout component
│   │   ├── +error.els # Error boundary component
│   │   ├── api/       # API routes
│   │   │   └── +server.ts # API endpoint
│   │   └── [slug]/    # Dynamic routes
│   │       └── +page.els
│   ├── components/    # Reusable components
│   └── static/        # Static files
├── src/
│   ├── index.ts       # Entry point
│   ├── elysium.ts     # Core framework
│   ├── utils/         # Utility functions
│   └── plugins/       # Plugins
├── .env               # Environment variables
├── .env.local         # Local environment variables (git-ignored)
├── package.json
├── tsconfig.json
└── README.md
```

## Running the Application

To start the development server:

```bash
bun dev
```

This will start the server at `http://localhost:3000`.

For production:

```bash
bun run build
bun start
```

## File Conventions

Elysium.js uses specific file extensions and naming conventions:

### Component Files (.els)
- `+page.els`: Page components
- `+layout.els`: Layout components
- `+error.els`: Error boundary components
- `+loading.els`: Loading state components

### Server Files (.ts)
- `+page.server.ts`: Server-side data loading for pages
- `+layout.server.ts`: Server-side data loading for layouts
- `+server.ts`: API endpoints

## Component Syntax

Elysium.js uses a SvelteKit-inspired component syntax with HTMX integration:

```html
<script>
  // TypeScript code here
  import { onMount, useState } from 'elysium';
  
  // State management
  const [count, setCount] = useState(0);
  
  // Lifecycle hooks
  onMount(() => {
    // Component mounted
  });
  
  // Methods
  function handleClick() {
    // Handle events
  }
</script>

<!-- HTML template with HTMX attributes -->
<div>
  <button 
    hx-get="/api/data"
    hx-target="#result"
  >
    Load Data
  </button>
  
  <!-- Control flow syntax -->
  {#if condition}
    <p>Conditional content</p>
  {:else}
    <p>Alternative content</p>
  {/if}
  
  {#each items as item}
    <div>{item}</div>
  {/each}
</div>
```

## API Routes

API routes in Elysium.js are defined using Elysia's syntax:

```typescript
// app/routes/api/users/+server.ts
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app
    .get('/', ({ success }) => {
      return success([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
      ], 'Users retrieved successfully');
    })
    .post('/', ({ body, created }) => {
      // Create a new user
      return created({ id: 3, name: body.name }, 'User created successfully');
    })
    .get('/:id', ({ params, success, error }) => {
      // Get user by ID
      if (params.id === '1') {
        return success({ id: 1, name: 'John Doe' }, 'User retrieved successfully');
      }
      
      throw error.NotFound(`User with ID ${params.id} not found`);
    });
```

## Next Steps

Now that you have a basic understanding of Elysium.js, you can explore the following topics:

- [Project Structure](./project-structure.md) - Learn more about the project structure
- [Routing](./routing.md) - Learn about file-based routing
- [Components](./components.md) - Learn about component syntax and lifecycle
- [Data Fetching](./data-fetching.md) - Learn how to fetch data
- [Plugins](./plugins.md) - Learn about available plugins
- [Error Handling](./errors.md) - Learn about error handling
- [Standard Responses](./responses.md) - Learn about standardized API responses
- [Authentication](./auth.md) - Learn about JWT authentication
- [Task Scheduling](./cron.md) - Learn about cron jobs
- [ORM Integration](./orm.md) - Learn about database integration
- [Deployment](./deployment.md) - Learn how to deploy your application
