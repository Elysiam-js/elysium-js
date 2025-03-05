# Layouts

Layouts provide a consistent structure for your pages. They allow you to define common elements like headers, footers, and navigation that should appear on multiple pages.

## Creating a Layout

Layouts are defined in the `app/layouts` directory. Here's an example of a basic layout:

```tsx
// app/layouts/BaseLayout.tsx
import { PropsWithChildren } from 'hono/jsx';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <head>
        <title>Elysium-js</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/main.css" />
        <script src="https://unpkg.com/htmx.org@1.9.6"></script>
      </head>
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
        </header>
        
        <main>
          {children}
        </main>
        
        <footer>
          <p>&copy; 2025 Elysium-js</p>
        </footer>
      </body>
    </html>
  );
};
```

## Using Layouts

You can use layouts in your routes by wrapping your page components:

```typescript
// app/routes/index.ts
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { BaseLayout } from '../layouts/BaseLayout';
import { HomePage } from './home';
import { AboutPage } from './about';

export const setupRoutes = new Elysia()
  .get('/', ({ html }) => html(
    <BaseLayout>
      <HomePage />
    </BaseLayout>
  ))
  .get('/about', ({ html }) => html(
    <BaseLayout>
      <AboutPage />
    </BaseLayout>
  ));
```

## Nested Layouts

You can create nested layouts for more complex page structures:

```tsx
// app/layouts/DashboardLayout.tsx
import { PropsWithChildren } from 'hono/jsx';
import { BaseLayout } from './BaseLayout';

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <BaseLayout>
      <div class="dashboard-container">
        <aside class="sidebar">
          <nav>
            <a href="/dashboard">Dashboard</a>
            <a href="/dashboard/profile">Profile</a>
            <a href="/dashboard/settings">Settings</a>
          </nav>
        </aside>
        
        <div class="content">
          {children}
        </div>
      </div>
    </BaseLayout>
  );
};
```

Then use it in your routes:

```typescript
// app/routes/index.ts
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { BaseLayout } from '../layouts/BaseLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { HomePage } from './home';
import { AboutPage } from './about';
import { DashboardPage } from './dashboard';
import { ProfilePage } from './dashboard/profile';

export const setupRoutes = new Elysia()
  .get('/', ({ html }) => html(
    <BaseLayout>
      <HomePage />
    </BaseLayout>
  ))
  .get('/about', ({ html }) => html(
    <BaseLayout>
      <AboutPage />
    </BaseLayout>
  ))
  .get('/dashboard', ({ html }) => html(
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  ))
  .get('/dashboard/profile', ({ html }) => html(
    <DashboardLayout>
      <ProfilePage />
    </DashboardLayout>
  ));
```

## Layout Props

You can pass props to your layouts for more flexibility:

```tsx
// app/layouts/PageLayout.tsx
type PageLayoutProps = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export const PageLayout = ({ 
  children, 
  title, 
  description 
}: PageLayoutProps) => {
  return (
    <BaseLayout>
      <div class="page-container">
        <header class="page-header">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </header>
        
        <div class="page-content">
          {children}
        </div>
      </div>
    </BaseLayout>
  );
};
```

Then use it in your routes:

```typescript
// app/routes/index.ts
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { PageLayout } from '../layouts/PageLayout';
import { HomePage } from './home';
import { AboutPage } from './about';

export const setupRoutes = new Elysia()
  .get('/', ({ html }) => html(
    <PageLayout title="Home" description="Welcome to Elysium-js">
      <HomePage />
    </PageLayout>
  ))
  .get('/about', ({ html }) => html(
    <PageLayout title="About" description="Learn more about Elysium-js">
      <AboutPage />
    </PageLayout>
  ));
```

## Dynamic Layouts

You can create dynamic layouts based on route parameters or other conditions:

```typescript
// app/routes/index.ts
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { BaseLayout } from '../layouts/BaseLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { UserPage } from './users';

export const setupRoutes = new Elysia()
  .get('/users/:id', ({ params, html }) => {
    // Choose layout based on user role
    const userId = params.id;
    const isAdmin = userId === 'admin';
    
    const Layout = isAdmin ? AdminLayout : DashboardLayout;
    
    return html(
      <Layout>
        <UserPage id={userId} />
      </Layout>
    );
  });
```

## HTMX Integration

Layouts work well with HTMX for dynamic content updates. You can use HTMX to update only parts of your page without reloading the entire layout:

```tsx
// app/layouts/BaseLayout.tsx
import { PropsWithChildren } from 'hono/jsx';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <head>
        <title>Elysium-js</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/main.css" />
        <script src="https://unpkg.com/htmx.org@1.9.6"></script>
      </head>
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
        </header>
        
        <main id="content">
          {children}
        </main>
        
        <footer>
          <p>&copy; 2025 Elysium-js</p>
        </footer>
      </body>
    </html>
  );
};
```

Then in your page components:

```tsx
// app/routes/home.tsx
export const HomePage = () => {
  return (
    <div>
      <h1>Home</h1>
      <button 
        hx-get="/about" 
        hx-target="#content" 
        hx-push-url="true"
      >
        Go to About
      </button>
    </div>
  );
};
```

This will update only the `#content` element when the button is clicked, without reloading the entire page.

## Best Practices

- Keep layouts simple and focused on structure
- Use components for reusable UI elements
- Use nested layouts for complex page structures
- Pass props to layouts for flexibility
- Use HTMX for dynamic content updates
