# Customization

<GlassyCard 
  title="Customizing Elysium-js" 
  icon="🎨"
  description="Learn how to customize and extend your Elysium-js application to fit your specific needs">

Elysium-js is designed to be flexible and customizable, allowing you to adapt the framework to your specific requirements. This guide covers various ways to customize your Elysium-js application.

</GlassyCard>

## Configuration Options

### Project Configuration

You can customize your Elysium-js project by modifying the configuration files:

```
your-project/
├── elysium.config.js  # Main configuration file
├── tsconfig.json      # TypeScript configuration
└── ...
```

#### elysium.config.js

The `elysium.config.js` file allows you to configure various aspects of your application:

```javascript
// elysium.config.js
export default {
  // Server configuration
  server: {
    port: 3000,
    host: 'localhost',
    cors: true
  },
  
  // Static file configuration
  static: {
    dir: 'static',
    prefix: '/'
  },
  
  // Database configuration
  database: {
    type: 'turso', // or 'prisma', 'drizzle'
    url: process.env.DATABASE_URL
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    minify: true
  }
};
```

### Environment Variables

You can customize your application's behavior using environment variables. Create a `.env` file in your project root:

```
# .env
PORT=4000
HOST=0.0.0.0
DATABASE_URL=libsql://your-database.turso.io
```

Then access these variables in your code:

```typescript
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
```

## Extending Elysia

Elysium-js is built on top of Elysia, which means you can use all of Elysia's extension mechanisms.

### Custom Plugins

You can create custom plugins to extend the functionality of your application:

```typescript
// app/plugins/logger.ts
import { Elysia } from 'elysia';

export const logger = new Elysia({
  name: 'logger'
})
.onRequest(({ request }) => {
  console.log(`${request.method} ${request.url}`);
})
.onResponse(({ request, response }) => {
  console.log(`${request.method} ${request.url} - ${response.status}`);
});
```

Then use the plugin in your application:

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { logger } from '../app/plugins/logger';

const app = new Elysia()
  .use(logger)
  // ... rest of your application
  .listen(3000);
```

### Custom Decorators

You can create custom decorators to add functionality to your request handlers:

```typescript
// app/decorators/auth.ts
import { Elysia } from 'elysia';

export const auth = new Elysia()
  .derive(({ request, set }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return { isAuthenticated: false, user: null };
    }
    
    const token = authHeader.split(' ')[1];
    // Validate token and get user
    // ...
    
    return {
      isAuthenticated: true,
      user: { id: '123', name: 'John Doe' }
    };
  });
```

Then use the decorator in your routes:

```typescript
// app/routes/api/profile.ts
import { Elysia } from 'elysia';
import { auth } from '../../decorators/auth';

export const profileRoutes = new Elysia()
  .use(auth)
  .get('/profile', ({ isAuthenticated, user, set }) => {
    if (!isAuthenticated) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
    
    return { user };
  });
```

## Custom Middleware

You can create custom middleware to process requests and responses:

```typescript
// app/middleware/cors.ts
import { Elysia } from 'elysia';

export const cors = new Elysia()
  .onRequest(({ set }) => {
    set.headers['Access-Control-Allow-Origin'] = '*';
    set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    set.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  })
  .options('*', ({ set }) => {
    set.status = 204;
    return '';
  });
```

Then use the middleware in your application:

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { cors } from '../app/middleware/cors';

const app = new Elysia()
  .use(cors)
  // ... rest of your application
  .listen(3000);
```

## Custom Error Handling

You can customize how errors are handled in your application:

```typescript
// app/error-handlers/index.ts
import { Elysia } from 'elysia';

export const errorHandlers = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { error: 'Not Found', message: error.message };
    }
    
    if (code === 'VALIDATION') {
      set.status = 400;
      return { error: 'Bad Request', message: error.message };
    }
    
    // Default error handler
    console.error(error);
    set.status = 500;
    return { error: 'Internal Server Error', message: 'Something went wrong' };
  });
```

Then use the error handlers in your application:

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { errorHandlers } from '../app/error-handlers';

const app = new Elysia()
  .use(errorHandlers)
  // ... rest of your application
  .listen(3000);
```

## Custom Database Integration

Elysium-js supports multiple database options, but you can also integrate custom database solutions:

```typescript
// app/db/custom.ts
import { createClient } from 'your-database-client';

export const db = createClient({
  url: process.env.DATABASE_URL,
  // ... other options
});

// Example query function
export async function query(sql, params = []) {
  return db.query(sql, params);
}
```

Then use your custom database in your application:

```typescript
// app/routes/api/users.ts
import { Elysia } from 'elysia';
import { query } from '../../db/custom';

export const userRoutes = new Elysia()
  .get('/users', async () => {
    const users = await query('SELECT * FROM users');
    return users;
  })
  .get('/users/:id', async ({ params }) => {
    const [user] = await query('SELECT * FROM users WHERE id = ?', [params.id]);
    return user;
  });
```

## Custom Authentication

You can implement custom authentication mechanisms:

```typescript
// app/auth/jwt.ts
import { Elysia } from 'elysia';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const jwtAuth = new Elysia()
  .derive(({ request, set }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return { isAuthenticated: false, user: null };
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return { isAuthenticated: true, user: decoded };
    } catch (error) {
      set.status = 401;
      return { isAuthenticated: false, user: null };
    }
  });
```

## Custom Layouts

You can create custom layouts for your application:

```tsx
// app/layouts/CustomLayout.tsx
import type { PropsWithChildren } from '@elysiajs/html';

interface CustomLayoutProps extends PropsWithChildren {
  title: string;
}

export function CustomLayout({ children, title }: CustomLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} - My App</title>
        <link rel="stylesheet" href="/css/custom.css" />
      </head>
      <body>
        <header className="bg-purple-600 text-white p-4">
          <h1 className="text-2xl font-bold">{title}</h1>
        </header>
        
        <main className="container mx-auto p-4">
          {children}
        </main>
        
        <footer className="bg-gray-100 p-4 text-center">
          <p>&copy; {new Date().getFullYear()} My App</p>
        </footer>
      </body>
    </html>
  );
}
```

Then use your custom layout in your routes:

```tsx
// app/routes/custom.tsx
import { CustomLayout } from '../layouts/CustomLayout';

export default function CustomPage() {
  return (
    <CustomLayout title="Custom Page">
      <h2 className="text-xl font-bold mb-4">Welcome to the Custom Page</h2>
      <p>This page uses a custom layout.</p>
    </CustomLayout>
  );
}
```

## Custom Styling

### CSS Frameworks

Elysium-js works well with CSS frameworks like Tailwind CSS:

```bash
bun add -D tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

Configure Tailwind CSS:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
    },
  },
  plugins: [],
};
```

Create a CSS file:

```css
/* static/css/styles.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply px-4 py-2 rounded font-medium transition-colors;
  }
  
  .btn-primary {
    @apply bg-primary-500 hover:bg-primary-600 text-white;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800;
  }
}
```

### Custom Themes

You can create custom themes for your application:

```css
/* static/css/themes/dark.css */
:root {
  --background: #1a1a1a;
  --text: #ffffff;
  --primary: #8b5cf6;
  --secondary: #4c1d95;
  --accent: #c4b5fd;
}

body {
  background-color: var(--background);
  color: var(--text);
}

/* static/css/themes/light.css */
:root {
  --background: #ffffff;
  --text: #1a1a1a;
  --primary: #7c3aed;
  --secondary: #6d28d9;
  --accent: #a78bfa;
}

body {
  background-color: var(--background);
  color: var(--text);
}
```

Then load the appropriate theme based on user preference:

```tsx
// app/layouts/ThemedLayout.tsx
import type { PropsWithChildren } from '@elysiajs/html';

interface ThemedLayoutProps extends PropsWithChildren {
  theme?: 'light' | 'dark';
}

export function ThemedLayout({ children, theme = 'light' }: ThemedLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href={`/css/themes/${theme}.css`} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

## Conclusion

Elysium-js provides many ways to customize your application to fit your specific needs. By leveraging Elysia's extension mechanisms, custom layouts, and styling options, you can create a unique and tailored experience for your users.
