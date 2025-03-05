# Code Organization

<GlassyCard 
  title="Organizing Your Elysium-js Project" 
  icon="📂"
  description="Learn best practices for organizing your Elysium-js codebase for maintainability and scalability">

A well-organized codebase is easier to understand, maintain, and extend. This guide covers best practices for organizing your Elysium-js project.

</GlassyCard>

## Project Structure

Elysium-js follows a structure inspired by SvelteKit, with some adaptations for the BETH stack:

```
your-project/
├── app/                  # Application code
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Page layouts
│   ├── models/           # Data models and schemas
│   ├── routes/           # Page and API routes
│   │   ├── api/          # API routes
│   │   └── ...           # Page routes
│   ├── db/               # Database configuration
│   ├── utils/            # Utility functions
│   └── middleware/       # Custom middleware
├── static/               # Static assets
├── prisma/               # Prisma schema and migrations (if using Prisma)
├── src/                  # Core application code
│   └── index.ts          # Entry point
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Directory Structure Guidelines

### app/ Directory

The `app/` directory contains most of your application code:

#### components/

The `components/` directory contains reusable UI components:

```
app/components/
├── ui/                   # Basic UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── ...
├── forms/                # Form components
│   ├── Input.tsx
│   ├── Select.tsx
│   └── ...
├── layout/               # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
└── ...
```

#### layouts/

The `layouts/` directory contains page layouts:

```
app/layouts/
├── BaseLayout.tsx        # Base layout with common elements
├── AuthLayout.tsx        # Layout for authenticated pages
├── AdminLayout.tsx       # Layout for admin pages
└── ...
```

#### models/

The `models/` directory contains data models and schemas:

```
app/models/
├── user.ts               # User model
├── post.ts               # Post model
├── comment.ts            # Comment model
└── ...
```

#### routes/

The `routes/` directory contains page and API routes:

```
app/routes/
├── index.ts              # Home page route
├── about.ts              # About page route
├── dashboard.ts          # Dashboard page route
├── api/                  # API routes
│   ├── users.ts          # User API routes
│   ├── posts.ts          # Post API routes
│   └── ...
└── ...
```

#### db/

The `db/` directory contains database configuration:

```
app/db/
├── index.ts              # Database client setup
├── schema.ts             # Database schema (if using Drizzle)
├── migrations/           # Database migrations
└── ...
```

#### utils/

The `utils/` directory contains utility functions:

```
app/utils/
├── auth.ts               # Authentication utilities
├── validation.ts         # Validation utilities
├── formatting.ts         # Formatting utilities
└── ...
```

#### middleware/

The `middleware/` directory contains custom middleware:

```
app/middleware/
├── auth.ts               # Authentication middleware
├── logger.ts             # Logging middleware
├── cors.ts               # CORS middleware
└── ...
```

### static/ Directory

The `static/` directory contains static assets:

```
static/
├── images/               # Image files
├── css/                  # CSS files
├── js/                   # JavaScript files
├── fonts/                # Font files
└── ...
```

### prisma/ Directory

If you're using Prisma, the `prisma/` directory contains the Prisma schema and migrations:

```
prisma/
├── schema.prisma         # Prisma schema
├── migrations/           # Prisma migrations
└── ...
```

### src/ Directory

The `src/` directory contains the core application code:

```
src/
├── index.ts              # Application entry point
└── ...
```

## Naming Conventions

### Files and Directories

- Use **PascalCase** for component files: `Button.tsx`, `Card.tsx`
- Use **camelCase** for utility files: `auth.ts`, `validation.ts`
- Use **kebab-case** for static assets: `hero-image.png`, `main-styles.css`

### Components

- Use **PascalCase** for component names: `Button`, `Card`
- Use descriptive names that indicate the component's purpose

```tsx
// Good
export function UserProfile() { ... }

// Bad
export function Profile() { ... }
```

### Functions

- Use **camelCase** for function names: `getUserById`, `formatDate`
- Use descriptive names that indicate the function's purpose

```typescript
// Good
function calculateTotalPrice(items) { ... }

// Bad
function calculate(items) { ... }
```

### Variables

- Use **camelCase** for variable names: `userName`, `isAuthenticated`
- Use descriptive names that indicate the variable's purpose

```typescript
// Good
const userEmail = 'user@example.com';

// Bad
const email = 'user@example.com';
```

### Constants

- Use **UPPER_SNAKE_CASE** for constants: `MAX_ITEMS`, `API_URL`

```typescript
// Good
const MAX_RETRY_ATTEMPTS = 3;

// Bad
const maxRetryAttempts = 3;
```

## Module Organization

### Imports

- Group imports by type:
  1. External libraries
  2. Internal modules
  3. Relative imports
- Sort imports alphabetically within each group

```typescript
// External libraries
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';

// Internal modules
import { db } from '../db';
import { auth } from '../middleware/auth';

// Relative imports
import { Button } from './Button';
import { Card } from './Card';
```

### Exports

- Use named exports for most modules
- Use default exports for components and pages

```typescript
// utils/formatting.ts
export function formatDate(date) { ... }
export function formatCurrency(amount) { ... }

// components/Button.tsx
export default function Button(props) { ... }
```

## Code Organization Within Files

### Component Files

Organize component files in this order:

1. Imports
2. Types and interfaces
3. Constants
4. Component function
5. Helper functions
6. Exports

```tsx
// Imports
import { useState } from 'react';

// Types and interfaces
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
}

// Constants
const VARIANTS = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-200 text-gray-800'
};

const SIZES = {
  sm: 'text-sm px-2 py-1',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3'
};

// Component function
export default function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  children
}: ButtonProps) {
  // Component logic
  
  return (
    <button
      className={`${VARIANTS[variant]} ${SIZES[size]} rounded`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Helper functions
function getButtonClasses(variant, size) {
  return `${VARIANTS[variant]} ${SIZES[size]} rounded`;
}
```

### Route Files

Organize route files in this order:

1. Imports
2. Route handler
3. Helper functions

```typescript
// Imports
import { Elysia } from 'elysia';
import { db } from '../db';

// Route handler
export const userRoutes = new Elysia()
  .get('/users', async () => {
    return await getUsers();
  })
  .get('/users/:id', async ({ params }) => {
    return await getUserById(params.id);
  });

// Helper functions
async function getUsers() {
  return await db.query('SELECT * FROM users');
}

async function getUserById(id) {
  return await db.query('SELECT * FROM users WHERE id = ?', [id]);
}
```

## Scalability Patterns

### Feature-Based Organization

For larger applications, consider organizing code by feature:

```
app/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.ts
│   ├── users/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.ts
│   └── ...
└── ...
```

### Shared Code

For code shared across features, use a `shared` or `common` directory:

```
app/
├── features/
│   ├── auth/
│   ├── users/
│   └── ...
├── shared/
│   ├── components/
│   ├── utils/
│   └── ...
└── ...
```

## Best Practices

### Keep Components Small

- Each component should have a single responsibility
- If a component becomes too large, split it into smaller components

### Use Consistent Patterns

- Use the same patterns throughout your codebase
- Document your patterns for team members

### Separate Concerns

- Separate business logic from UI components
- Use utility functions for reusable logic

### Document Your Code

- Use comments to explain complex logic
- Write documentation for important components and functions

### Use TypeScript

- Define interfaces for component props
- Use type annotations for function parameters and return values

## Conclusion

A well-organized codebase is essential for maintaining and scaling your Elysium-js application. By following these guidelines, you can create a codebase that is easy to understand, maintain, and extend.
