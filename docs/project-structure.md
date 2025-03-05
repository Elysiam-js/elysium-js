# Project Structure in Elysium.js

Elysium.js follows a SvelteKit-inspired project structure that is designed to be intuitive and scalable. This document explains the organization of an Elysium.js project.

## Overview

A typical Elysium.js project has the following structure:

```
app/
├── node_modules/
├── public/            # Static assets
├── app/
│   ├── routes/        # Application routes
│   │   ├── +page.els  # Home page component
│   │   ├── +layout.els # Layout component
│   │   ├── +error.els # Error boundary component
│   │   ├── +loading.els # Loading state component
│   │   ├── +page.server.ts # Server-side data loading
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

## Key Directories and Files

### `/app/routes`

The `routes` directory contains all your application routes. The file structure in this directory directly maps to your application's URL structure.

#### Special Files

- `+page.els`: Defines a page component
- `+layout.els`: Defines a layout component that wraps pages
- `+error.els`: Defines an error boundary component
- `+loading.els`: Defines a loading state component
- `+page.server.ts`: Contains server-side data loading logic for a page
- `+layout.server.ts`: Contains server-side data loading logic for a layout
- `+server.ts`: Defines an API endpoint

#### Examples

```
app/routes/
├── +page.els              # Route: /
├── +layout.els            # Layout for all pages
├── +error.els             # Error boundary for all pages
├── about/
│   └── +page.els          # Route: /about
├── blog/
│   ├── +page.els          # Route: /blog
│   ├── +layout.els        # Layout for blog pages
│   └── [slug]/
│       └── +page.els      # Route: /blog/:slug
└── api/
    ├── +server.ts         # API route: /api
    └── users/
        └── +server.ts     # API route: /api/users
```

### `/app/components`

The `components` directory contains reusable components that can be imported into your pages or layouts.

```
app/components/
├── Button.els
├── Card.els
├── Header.els
└── Footer.els
```

### `/app/static`

The `static` directory contains static files that are served directly by the server.

```
app/static/
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── images/
    └── logo.png
```

### `/src`

The `src` directory contains the core framework code.

#### `/src/index.ts`

The entry point of your application. This file initializes the Elysium.js framework and starts the server.

#### `/src/elysium.ts`

Contains the core framework utilities and functions.

#### `/src/utils`

Contains utility functions used by the framework.

```
src/utils/
├── autoRouter.ts
├── elsProcessor.ts
└── helpers.ts
```

#### `/src/plugins`

Contains plugins that extend the functionality of the framework.

```
src/plugins/
├── swagger.ts
├── cors.ts
├── logger.ts
├── env.ts
├── http.ts
├── errors.ts
├── response.ts
├── auth.ts
├── cron.ts
└── orm.ts
```

### Configuration Files

- `.env`: Environment variables for all environments
- `.env.local`: Local environment variables (git-ignored)
- `.env.development`: Development environment variables
- `.env.production`: Production environment variables
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.js`: Tailwind CSS configuration (if enabled)
- `prettier.config.js`: Prettier configuration (if enabled)
- `.eslintrc.js`: ESLint configuration (if enabled)

## File Naming Conventions

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

## Dynamic Routes

Dynamic routes are created by using square brackets in the directory name:

- `[id]`: Matches a single segment (e.g., `/users/123`)
- `[...slug]`: Matches multiple segments (e.g., `/blog/2023/01/hello-world`)

## Best Practices

1. **Keep Components Small**: Break down complex components into smaller, reusable ones.
2. **Organize by Feature**: For larger applications, consider organizing routes by feature.
3. **Use Layouts**: Use layouts to share common UI elements across multiple pages.
4. **Separate Concerns**: Keep server-side logic in `.server.ts` files and client-side logic in `.els` files.
5. **Type Everything**: Use TypeScript types for all your data structures.

## Example Project Structure

Here's an example of a more complex Elysium.js project structure:

```
app/
├── routes/
│   ├── +page.els
│   ├── +layout.els
│   ├── +error.els
│   ├── about/
│   │   └── +page.els
│   ├── blog/
│   │   ├── +page.els
│   │   ├── +layout.els
│   │   ├── +page.server.ts
│   │   └── [slug]/
│   │       ├── +page.els
│   │       └── +page.server.ts
│   ├── dashboard/
│   │   ├── +page.els
│   │   ├── +layout.els
│   │   ├── +layout.server.ts
│   │   ├── profile/
│   │   │   └── +page.els
│   │   └── settings/
│   │       └── +page.els
│   └── api/
│       ├── auth/
│       │   ├── +server.ts
│       │   └── callback/
│       │       └── +server.ts
│       ├── blog/
│       │   └── +server.ts
│       └── users/
│           └── +server.ts
├── components/
│   ├── common/
│   │   ├── Button.els
│   │   ├── Card.els
│   │   ├── Header.els
│   │   └── Footer.els
│   ├── blog/
│   │   ├── PostCard.els
│   │   └── CommentForm.els
│   └── dashboard/
│       ├── Sidebar.els
│       └── StatCard.els
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── api.ts
└── static/
    ├── css/
    ├── js/
    └── images/
```

This structure organizes components by feature and provides a clear separation of concerns.
