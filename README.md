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

## Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)

## Creating a New Project

```bash
bun create elysium app
```

During project creation, you'll be prompted to select:
- ORM (Turso, Prisma, or Drizzle)
- Whether to use Tailwind CSS

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

## Development

- **Adding a new page**:
  1. Create a new component in `app/routes/`
  2. Add a new route in `app/routes/index.ts`

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
