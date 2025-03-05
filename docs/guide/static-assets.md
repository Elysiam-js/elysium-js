# Static Assets

<GlassyCard 
  title="Managing Static Assets" 
  icon="📁"
  description="Learn how to handle static files like images, CSS, and JavaScript in your Elysium-js application">

Static assets are files that are served directly to the client without any processing. These include images, CSS files, JavaScript files, fonts, and other resources that your application needs.

</GlassyCard>

## Static Directory

Elysium-js follows the SvelteKit convention of using a `static` directory at the root of your project for all static assets:

```
your-project/
├── app/
├── static/
│   ├── images/
│   ├── css/
│   ├── js/
│   └── favicon.ico
└── ...
```

All files placed in the `static` directory will be available at the root path of your application.

## Accessing Static Assets

### In HTML

You can reference static assets in your HTML using absolute paths:

```html
<!-- Image -->
<img src="/images/logo.png" alt="Logo">

<!-- CSS -->
<link rel="stylesheet" href="/css/styles.css">

<!-- JavaScript -->
<script src="/js/main.js"></script>

<!-- Favicon -->
<link rel="icon" href="/favicon.ico">
```

### In CSS

Similarly, you can reference static assets in your CSS files:

```css
body {
  background-image: url('/images/background.jpg');
}

@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
}
```

## Static Plugin Configuration

Elysium-js uses the `@elysiajs/static` plugin to serve static assets. The plugin is configured in your application's entry point:

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';

const app = new Elysia()
  .use(staticPlugin({
    assets: 'static', // Directory containing static assets
    prefix: '/' // URL prefix for static assets
  }))
  // ... rest of your application
  .listen(3000);
```

### Configuration Options

The static plugin accepts several configuration options:

- `assets`: The directory containing your static assets (default: `'static'`)
- `prefix`: The URL prefix for your static assets (default: `'/'`)
- `alwaysStatic`: Whether to always serve static files, even in production (default: `true`)
- `headers`: Custom headers to add to static file responses
- `maxAge`: Cache control max-age in seconds (default: `0`)

Example with custom options:

```typescript
.use(staticPlugin({
  assets: 'public', // Using 'public' instead of 'static'
  prefix: '/assets', // Files will be served at /assets/...
  maxAge: 86400, // Cache for 24 hours
  headers: {
    'X-Custom-Header': 'value'
  }
}))
```

## Best Practices

### Organizing Static Assets

It's a good practice to organize your static assets by type:

```
static/
├── images/
├── css/
├── js/
├── fonts/
└── ...
```

This makes it easier to manage your assets as your application grows.

### Image Optimization

For images, consider using optimized formats like WebP and AVIF alongside traditional formats:

```html
<picture>
  <source srcset="/images/logo.avif" type="image/avif">
  <source srcset="/images/logo.webp" type="image/webp">
  <img src="/images/logo.png" alt="Logo">
</picture>
```

### Caching

For production, set appropriate cache headers for static assets:

```typescript
.use(staticPlugin({
  assets: 'static',
  prefix: '/',
  maxAge: 31536000, // 1 year for immutable assets
  headers: {
    'Cache-Control': 'public, max-age=31536000, immutable'
  }
}))
```

For assets that change frequently, use a shorter cache duration or add a version parameter to the URL:

```html
<link rel="stylesheet" href="/css/styles.css?v=1.0.0">
```

## Handling Assets in Development vs. Production

In development, assets are served directly from the `static` directory. In production, you might want to use a CDN for better performance.

### Using Environment Variables for CDN URLs

```typescript
// src/config.ts
export const config = {
  staticUrl: process.env.STATIC_URL || '/'
};

// In your HTML templates
<img src="${config.staticUrl}images/logo.png" alt="Logo">
```

### Setting Up a CDN

For production, you can use a CDN like Cloudflare, AWS CloudFront, or Vercel Edge Network to serve your static assets:

1. Upload your static assets to the CDN
2. Set the `STATIC_URL` environment variable to the CDN URL
3. Reference assets using the `config.staticUrl` prefix

## Dynamic Asset Imports

For JavaScript modules, you can use dynamic imports to load assets only when needed:

```javascript
// Dynamically import a module
const loadModule = async () => {
  const module = await import('/js/module.js');
  module.default();
};

// Call when needed
button.addEventListener('click', loadModule);
```

## Serving Assets from Different Directories

If you need to serve assets from multiple directories, you can configure multiple static plugins:

```typescript
.use(staticPlugin({
  assets: 'static',
  prefix: '/'
}))
.use(staticPlugin({
  assets: 'uploads',
  prefix: '/uploads'
}))
```

This allows you to serve user-uploaded files from a different directory than your application's static assets.

## Conclusion

Properly managing static assets is essential for building performant web applications. Elysium-js makes it easy to serve static files with the `@elysiajs/static` plugin, while following conventions that should be familiar to developers coming from other modern frameworks.
