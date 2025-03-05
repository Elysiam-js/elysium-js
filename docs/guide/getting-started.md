# Getting Started

Getting started with Elysium-js is quick and easy. You can either use the CLI to create a new project or set up a project manually.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Bun](https://bun.sh/) (v1.0.0 or higher)

## Creating a New Project

The easiest way to get started is to use the Elysium-js CLI:

```bash
bun create elysium app
```

This command will create a new Elysium-js project in a directory called `app`.

During project creation, you'll be prompted to select:
- ORM (Turso, Prisma, or Drizzle)
- Whether to use Tailwind CSS

### Options

You can also specify options directly:

```bash
bun create elysium app --orm=turso --tailwind
```

## Manual Setup

If you prefer to set up a project manually, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/elysium-js.git
   cd elysium-js
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

After creating a new project, you'll have a directory structure that looks like this:

```
elysium-js/
├── app/                # Application code
│   ├── components/     # Reusable UI components
│   ├── db/             # Database configuration
│   ├── layouts/        # Layout components
│   ├── lib/            # Utility functions and shared code
│   ├── models/         # Data models
│   └── routes/         # Page and API routes
│       └── api/        # API endpoints
├── drizzle/            # Database migrations
├── static/             # Static assets
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

## Next Steps

Now that you have a working Elysium-js project, you can:

1. Learn about [Project Structure](/guide/project-structure)
2. Explore [Routing](/guide/routing)
3. Set up your [Database](/guide/database)
4. Create [Layouts](/guide/layouts)
5. Add [HTMX Integration](/guide/htmx)
