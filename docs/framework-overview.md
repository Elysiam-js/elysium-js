# Elysium.js Framework Overview

Elysium.js is a modern full-stack framework built on Bun, Elysia, Turso, and HTMX. It provides a lightweight, ergonomic, and flexible development experience that can scale from small projects to enterprise applications.

## Core Philosophy

Elysium.js is designed with the following principles in mind:

- **Lightweight**: Minimal dependencies and small bundle size
- **Ergonomic**: Developer-friendly APIs and conventions
- **Flexible**: Adaptable to various project sizes and requirements
- **Scalable**: Suitable for both small projects and enterprise applications
- **Modern**: Leveraging the latest web technologies and best practices

## Key Technologies

- **Bun**: A fast JavaScript runtime and package manager
- **Elysia**: A high-performance TypeScript web framework
- **Turso**: An edge-ready SQLite database
- **HTMX**: A library for creating dynamic interfaces with minimal JavaScript

## Project Structure

Elysium.js follows a SvelteKit-inspired project structure with file-based routing:

```
app/
├── routes/        # Application routes
│   ├── +page.els  # Home page component
│   ├── +layout.els # Layout component
│   ├── api/       # API routes
│   │   └── +server.ts # API endpoint
│   └── [slug]/    # Dynamic routes
│       └── +page.els
├── components/    # Reusable components
└── static/        # Static files
```

## File Conventions

Elysium.js uses specific file extensions for different types of files:

1. Component files use the `.els` extension:
   - `+page.els`: Page components
   - `+layout.els`: Layout components
   - `+error.els`: Error boundary components
   - `+loading.els`: Loading state components

2. Server-side files use the `.ts` extension:
   - `+page.server.ts`: Server-side data loading for pages
   - `+layout.server.ts`: Server-side data loading for layouts
   - `+server.ts`: API endpoints

## Component Syntax

Elysium.js uses a unique component syntax inspired by SvelteKit but with HTMX integration:

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

## Core Features

### Routing

- File-based routing system
- Dynamic routes with parameters
- Nested layouts
- API routes
- Error boundaries
- Loading states

### Data Fetching

- Server-side data loading
- Client-side data fetching with HTMX
- Built-in HTTP client for external API requests
- ORM integration for database access

### UI Components

- Component-based architecture
- State management
- Lifecycle hooks
- Control flow directives
- HTMX integration for dynamic UI

### Static Assets

- Static file serving
- Public assets directory
- Asset optimization

## Built-in Plugins

### Swagger UI Documentation

- Auto-generates API documentation from code
- Accessible via `/swagger` endpoint
- Configurable through the `setupSwagger` function

### CORS Protection

- Configurable CORS settings
- Implemented using `@elysiajs/cors`

### HTTP Client with Axios

- Built-in HTTP client for making external requests
- Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Includes interceptors for request/response manipulation

### Environment Variables Support

- Public and private variables
- Loads from `.env`, `.env.local`, and `.env.[environment]` files
- Type-safe access with `env.get()`, `env.getNumber()`, `env.getBoolean()`

### Logging System

- Structured logging with different log levels
- Support for colorized output
- File logging capability

### Error Handling

- Built-in HTTP error classes
- Standardized error response format
- Automatic error handling middleware
- Error boundaries for client-side error handling

### Standardized API Responses

- Consistent response format for API endpoints
- Helper methods for common response types
- Configurable response structure

### JWT Authentication

- Token generation and verification
- Route protection with middleware
- Access to authenticated user in route handlers
- Configurable token settings

### Task Scheduling

- Cron job scheduling
- Task management API
- Timezone support
- Error handling for tasks

### ORM Integration

- Support for multiple ORMs:
  - Turso (SQLite for the edge)
  - Prisma (full-featured ORM)
  - Drizzle (lightweight TypeScript ORM)
- Type-safe database access

## Optional Features

These features can be enabled during project creation:

- **WebSockets**: Real-time communication
- **GraphQL**: GraphQL API support
- **Tailwind CSS**: Utility-first CSS framework
- **Prettier**: Code formatting
- **ESLint**: Code linting

## Getting Started

To create a new Elysium.js project:

```bash
bun create elysium app
```

This will guide you through the project creation process with various options.

## Documentation

Comprehensive documentation is available for all aspects of the framework:

- Getting Started
- Project Structure
- Routing
- Components
- Data Fetching
- Plugins
- Error Handling
- Standard Responses
- Authentication
- Task Scheduling
- ORM Integration
- Deployment

## Development Roadmap

Future development of Elysium.js will focus on:

1. **Performance Optimization**: Further improving runtime performance
2. **Developer Experience**: Enhancing tooling and debugging capabilities
3. **Ecosystem Expansion**: Adding more plugins and integrations
4. **Testing Utilities**: Comprehensive testing tools and helpers
5. **Documentation**: Expanding examples and tutorials

## Community and Support

Elysium.js is an open-source project with a growing community. Contributions, bug reports, and feature requests are welcome on GitHub.
