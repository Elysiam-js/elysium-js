# Components in Elysium.js

Elysium.js uses a unique component syntax inspired by SvelteKit but integrated with HTMX for interactive UI without complex JavaScript frameworks.

## Component Files

Components in Elysium.js use the `.els` file extension. There are several special component types:

- `+page.els`: Page components
- `+layout.els`: Layout components
- `+error.els`: Error boundary components
- `+loading.els`: Loading state components

## Component Syntax

A typical Elysium.js component has the following structure:

```html
<script>
  // TypeScript code here
  import { onMount, useState } from 'elysium';
  
  // Props
  export let title = 'Default Title';
  export let items = [];
  
  // State management
  const [count, setCount] = useState(0);
  
  // Lifecycle hooks
  onMount(() => {
    console.log('Component mounted');
  });
  
  // Methods
  function handleClick() {
    setCount(count + 1);
  }
</script>

<!-- HTML template with HTMX attributes -->
<div>
  <h1>{title}</h1>
  
  <p>Count: {count}</p>
  
  <button onclick="handleClick()">
    Increment
  </button>
  
  <button 
    hx-get="/api/data"
    hx-target="#result"
    hx-swap="innerHTML"
  >
    Load Data
  </button>
  
  <div id="result">
    <!-- Dynamic content will be loaded here -->
  </div>
  
  <!-- Control flow syntax -->
  {#if count > 5}
    <p>Count is greater than 5</p>
  {:else}
    <p>Count is less than or equal to 5</p>
  {/if}
  
  {#each items as item, index}
    <div>{index + 1}. {item}</div>
  {/each}
</div>
```

## Script Section

The `<script>` section contains TypeScript code that defines the component's behavior.

### Imports

```typescript
import { onMount, useState } from 'elysium';
import Button from '../components/Button.els';
```

### Props

Props are defined using the `export let` syntax:

```typescript
export let title = 'Default Title'; // With default value
export let required; // Required prop (no default value)
```

### State Management

Elysium.js provides a React-like `useState` hook for managing component state:

```typescript
const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: '', email: '' });

// Update state
function increment() {
  setCount(count + 1);
}

function updateUser(name, email) {
  setUser({ name, email });
}
```

### Lifecycle Hooks

Elysium.js provides lifecycle hooks for components:

```typescript
// Called when the component is mounted
onMount(() => {
  console.log('Component mounted');
  
  // Cleanup function (called when component is unmounted)
  return () => {
    console.log('Component unmounted');
  };
});

// Called when the component is updated
onUpdate(() => {
  console.log('Component updated');
});

// Called before the component is unmounted
onBeforeUnmount(() => {
  console.log('Component will unmount');
});
```

### Methods

You can define methods in the script section:

```typescript
function handleClick() {
  setCount(count + 1);
}

async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  setItems(data);
}
```

## Template Section

The template section contains HTML with special syntax for dynamic content and control flow.

### Text Interpolation

```html
<h1>{title}</h1>
<p>Hello, {user.name}!</p>
```

### Attributes

```html
<input value="{name}" placeholder="Enter your name">
<div class="{active ? 'active' : ''}">Content</div>
```

### Event Handling

```html
<button onclick="handleClick()">Click Me</button>
<input onchange="handleChange(event)">
```

### HTMX Integration

Elysium.js integrates with HTMX for dynamic content loading:

```html
<button 
  hx-get="/api/data"
  hx-target="#result"
  hx-swap="innerHTML"
>
  Load Data
</button>

<div id="result">
  <!-- Dynamic content will be loaded here -->
</div>
```

### Control Flow

#### Conditionals

```html
{#if condition}
  <p>Shown when condition is true</p>
{:else if anotherCondition}
  <p>Shown when anotherCondition is true</p>
{:else}
  <p>Shown when all conditions are false</p>
{/if}
```

#### Loops

```html
{#each items as item}
  <div>{item}</div>
{/each}

{#each items as item, index}
  <div>{index + 1}. {item}</div>
{/each}

{#each Object.entries(obj) as [key, value]}
  <div>{key}: {value}</div>
{/each}
```

#### Keyed Each Blocks

```html
{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}
```

#### Await Blocks

```html
{#await promise}
  <p>Loading...</p>
{:then value}
  <p>The value is {value}</p>
{:catch error}
  <p>Error: {error.message}</p>
{/await}
```

## Component Composition

### Importing Components

```html
<script>
  import Header from '../components/Header.els';
  import Button from '../components/Button.els';
</script>

<Header title="My Page" />

<Button onClick="handleClick">
  Click Me
</Button>
```

### Slots

Slots allow you to pass content to components:

```html
<!-- Button.els -->
<script>
  export let type = 'button';
  export let onClick;
</script>

<button type="{type}" onclick="{onClick}" class="btn">
  <slot>Default Button Text</slot>
</button>

<!-- Usage -->
<Button onClick="handleClick">
  Custom Button Text
</Button>
```

### Named Slots

```html
<!-- Card.els -->
<div class="card">
  <div class="card-header">
    <slot name="header">Default Header</slot>
  </div>
  <div class="card-body">
    <slot>Default Content</slot>
  </div>
  <div class="card-footer">
    <slot name="footer">Default Footer</slot>
  </div>
</div>

<!-- Usage -->
<Card>
  <h2 slot="header">Card Title</h2>
  <p>Card content goes here</p>
  <div slot="footer">
    <Button>OK</Button>
    <Button>Cancel</Button>
  </div>
</Card>
```

## Special Components

### Page Components

Page components are defined in `+page.els` files and represent a route in your application.

```html
<!-- app/routes/about/+page.els -->
<script>
  import { onMount } from 'elysium';
  
  onMount(() => {
    console.log('About page mounted');
  });
</script>

<h1>About Us</h1>
<p>This is the about page.</p>
```

### Layout Components

Layout components are defined in `+layout.els` files and wrap page components.

```html
<!-- app/routes/+layout.els -->
<script>
  import Header from '../components/Header.els';
  import Footer from '../components/Footer.els';
</script>

<div class="layout">
  <Header />
  <main>
    <slot></slot>
  </main>
  <Footer />
</div>
```

### Error Boundary Components

Error boundary components are defined in `+error.els` files and catch errors in their child components.

```html
<!-- app/routes/+error.els -->
<script>
  export let error;
</script>

<div class="error-container">
  <h1>Error</h1>
  <p>{error.message}</p>
  <button onclick="window.location.reload()">
    Reload Page
  </button>
</div>
```

### Loading State Components

Loading state components are defined in `+loading.els` files and shown while data is being loaded.

```html
<!-- app/routes/+loading.els -->
<div class="loading-container">
  <div class="spinner"></div>
  <p>Loading...</p>
</div>
```

## Best Practices

1. **Keep Components Small**: Break down complex components into smaller, reusable ones.
2. **Use TypeScript**: Take advantage of TypeScript for type safety.
3. **Separate Concerns**: Keep UI logic separate from business logic.
4. **Use HTMX Wisely**: Use HTMX for interactive UI without complex JavaScript.
5. **Document Props**: Document the props that your components accept.
6. **Use Slots**: Use slots to make components more flexible.
7. **Follow Naming Conventions**: Use consistent naming for components and files.
