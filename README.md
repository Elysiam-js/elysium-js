# Elysium JS

A modern full-stack web application built with the BETH stack:

- **B**un - Fast JavaScript runtime
- **E**lysia - TypeScript web framework
- **T**urso - SQLite database for the edge
- **H**TMX - HTML extensions for dynamic content

## Features

- Server-side rendering with Elysia JSX
- Interactive UI with HTMX (no complex JavaScript frameworks)
- Type-safe from frontend to backend
- Edge-ready database with Turso
- Modern CSS with Tailwind
- SvelteKit-inspired project structure
- Easy project creation with CLI
- SvelteKit-inspired component syntax with `.els` files
- Built-in Swagger UI documentation
- CORS protection
- HTTP client with Axios
- Environment variable support
- Integrated logging system
- Standardized error handling
- Standardized API responses
- JWT authentication
- Task scheduling with cron
- ORM integration (Turso, Prisma, Drizzle)
- WebSockets support (optional)
- GraphQL support (optional)
- Scheduled tasks (optional)

## Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)

## Creating a New Project

```bash
bun create elysium app
```

During project creation, you'll be prompted to select:
- ORM (Turso, Prisma, or Drizzle)
- Whether to use Tailwind CSS
- Whether to use Prettier
- Whether to use ESLint
- Whether to include WebSockets support
- Whether to include GraphQL support
- Whether to include scheduled tasks
- Whether to include Swagger documentation

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/elysium-js.git
   cd elysium-js
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up the database:
   - For local development, a SQLite database will be created automatically
   - For Turso cloud, update the connection details in `app/db/index.ts`
   - Run migrations:
     ```bash
     bun run drizzle-kit generate
     ```

4. Start the development server:
   ```bash
   bun run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
elysium-js/
├── app/                # Application code (SvelteKit-inspired structure)
│   ├── components/     # Reusable UI components
│   ├── db/             # Database configuration
│   ├── layouts/        # Layout components
│   ├── lib/            # Utility functions and shared code
│   ├── models/         # Data models
│   └── routes/         # Page and API routes
│       └── api/        # API endpoints
├── drizzle/            # Database migrations
├── static/             # Static assets (similar to SvelteKit)
│   └── styles/         # CSS files
├── src/                # Source files
│   └── index.ts        # Application entry point
├── .gitignore
├── create-elysium.js   # CLI tool for project creation
├── drizzle.config.ts   # Drizzle ORM configuration
├── package.json
├── README.md
└── tsconfig.json
```

## File Conventions

Elysium-js uses a file-based routing system with specific file extensions:

- **`.els`**: Component files (pages, layouts, error boundaries, loading states)
- **`.ts`**: Server-side files (data loading, API endpoints, utilities)

Special files:
- `+page.els`: Page component
- `+layout.els`: Layout component
- `+error.els`: Error boundary
- `+loading.els`: Loading state
- `+page.server.ts`: Server-side data loading for pages
- `+layout.server.ts`: Server-side data loading for layouts
- `+server.ts`: API endpoint

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Project Structure](./docs/project-structure.md)
- [Routing](./docs/routing.md)
- [Components](./docs/components.md)
- [Data Fetching](./docs/data-fetching.md)
- [Plugins](./docs/plugins.md)
- [Error Handling](./docs/errors.md)
- [Standard Responses](./docs/responses.md)
- [Authentication](./docs/auth.md)
- [Task Scheduling](./docs/cron.md)
- [ORM Integration](./docs/orm.md)
- [Deployment](./docs/deployment.md)

## Development

- **Adding a new page**:
  1. Create a new component in `app/routes/` with the `.els` extension
  2. For server-side data, add a corresponding `.server.ts` file
- **Adding a new API endpoint**:
  1. Create a new file in `app/routes/api/`
  2. Add the route to `app/routes/index.ts`

- **Database changes**:
  1. Update the model in `app/models/`
  2. Generate migrations: `bun run drizzle-kit generate`

## Deployment

1. Build the application:
   ```bash
   bun run build
   ```

2. Start the production server:
   ```bash
   bun run start
   ```

## License

MIT
