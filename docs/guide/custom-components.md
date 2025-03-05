# Custom Components

<GlassyCard 
  title="Building Reusable Components" 
  icon="🧩"
  description="Learn how to create and use custom components in your Elysium-js application">

Components are reusable pieces of UI that help you build consistent and maintainable applications. In Elysium-js, you can create custom components using JSX and TypeScript.

</GlassyCard>

## Creating Components

In Elysium-js, components are created as TypeScript functions that return JSX elements. These components can be placed in the `app/components` directory:

```
your-project/
├── app/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   └── ...
└── ...
```

### Basic Component

Here's a simple example of a Button component:

```tsx
// app/components/Button.tsx
import type { PropsWithChildren } from '@elysiajs/html';

type ButtonProps = PropsWithChildren<{
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
}>;

export function Button({ 
  children, 
  type = 'button', 
  variant = 'primary',
  onClick 
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  return (
    <button
      type={type}
      className={`px-4 py-2 rounded font-medium transition-colors ${variantClasses[variant]}`}
      onclick={onClick ? `${onClick}` : undefined}
    >
      {children}
    </button>
  );
}
```

### Component with Children

Components can accept children, which allows for composition:

```tsx
// app/components/Card.tsx
import type { PropsWithChildren } from '@elysiajs/html';

type CardProps = PropsWithChildren<{
  title?: string;
  footer?: JSX.Element;
}>;

export function Card({ children, title, footer }: CardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      {title && (
        <div className="border-b px-4 py-2 font-medium bg-gray-50">
          {title}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
      {footer && (
        <div className="border-t px-4 py-2 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
}
```

## Using Components

Once you've created your components, you can use them in your routes or other components:

```tsx
// app/routes/index.tsx
import { BaseLayout } from '../layouts/BaseLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export default function HomePage() {
  return (
    <BaseLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome to Elysium-js</h1>
      
      <Card 
        title="Getting Started" 
        footer={<Button variant="primary">Learn More</Button>}
      >
        <p>Elysium-js is a full-stack web framework built with the BETH stack.</p>
      </Card>
    </BaseLayout>
  );
}
```

## Component Libraries

### Creating a Component Library

As your application grows, you might want to organize your components into a library:

```
your-project/
├── app/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── forms/
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
└── ...
```

You can then create index files to export all components from a category:

```tsx
// app/components/ui/index.ts
export * from './Button';
export * from './Card';
// ...

// app/components/forms/index.ts
export * from './Input';
export * from './Select';
// ...
```

This allows you to import multiple components more easily:

```tsx
import { Button, Card } from '../components/ui';
import { Input, Select } from '../components/forms';
```

### Using External Component Libraries

You can also use external component libraries with Elysium-js. However, since Elysium-js uses JSX for server-side rendering, you'll need to adapt client-side component libraries for server-side use.

## Advanced Component Patterns

### Component Composition

Component composition is a powerful pattern that allows you to build complex UIs from simple components:

```tsx
// app/components/ui/Alert.tsx
import type { PropsWithChildren } from '@elysiajs/html';

type AlertProps = PropsWithChildren<{
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}>;

export function Alert({ 
  children, 
  type = 'info', 
  title 
}: AlertProps) {
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div className={`border rounded-lg p-4 ${typeClasses[type]}`}>
      {title && <div className="font-bold mb-2">{title}</div>}
      <div>{children}</div>
    </div>
  );
}
```

### Higher-Order Components

Higher-order components (HOCs) are functions that take a component and return a new component with additional props or behavior:

```tsx
// app/components/withAuth.tsx
import { redirect } from '../utils/redirect';

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    // Check if user is authenticated
    const isAuthenticated = props.session?.user != null;
    
    if (!isAuthenticated) {
      // Redirect to login page
      return redirect('/login');
    }
    
    // Render the component if authenticated
    return <Component {...props} />;
  };
}

// Usage
const ProtectedPage = withAuth(DashboardPage);
```

### Component Props with TypeScript

TypeScript allows you to define strict prop types for your components:

```tsx
// app/components/ui/Avatar.tsx
type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  className = '' 
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
    />
  );
}
```

## HTMX Integration

One of the strengths of Elysium-js is its integration with HTMX. You can create components that leverage HTMX for dynamic behavior:

```tsx
// app/components/TodoItem.tsx
interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoItem({ id, text, completed }: TodoItemProps) {
  return (
    <div className="flex items-center gap-2 py-2">
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/api/todos/${id}/toggle`}
        hx-swap="outerHTML"
        hx-target="closest div"
      />
      <span className={completed ? 'line-through text-gray-500' : ''}>
        {text}
      </span>
      <button
        className="ml-auto text-red-500"
        hx-delete={`/api/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        Delete
      </button>
    </div>
  );
}
```

### HTMX Component Patterns

When working with HTMX, there are several patterns you can use:

1. **Swap Pattern**: Replace the component with new content
2. **Target Pattern**: Update a different part of the page
3. **Trigger Pattern**: Trigger actions based on events

```tsx
// app/components/Counter.tsx
interface CounterProps {
  count: number;
}

export function Counter({ count }: CounterProps) {
  return (
    <div>
      <span id="count">{count}</span>
      <button
        hx-post="/api/counter/increment"
        hx-target="#count"
        hx-swap="innerHTML"
      >
        Increment
      </button>
    </div>
  );
}
```

## Best Practices

### Component Organization

- Keep components small and focused on a single responsibility
- Group related components together
- Use a consistent naming convention
- Create index files to export multiple components

### Component Design

- Design components to be reusable
- Use props for customization
- Provide sensible defaults
- Use TypeScript for type safety

### Performance

- Keep components simple
- Avoid unnecessary nesting
- Use HTMX for dynamic updates instead of full page reloads

## Conclusion

Custom components are a powerful way to build reusable and maintainable UIs in Elysium-js. By combining JSX, TypeScript, and HTMX, you can create dynamic and interactive applications with minimal client-side JavaScript.
