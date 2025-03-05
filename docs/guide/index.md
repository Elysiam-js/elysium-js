# Introduction to Elysium-js

<GlassyCard 
  title="What is Elysium-js?" 
  icon="✨"
  description="A modern full-stack web framework built with the BETH stack">

Elysium-js is a full-stack web framework designed to make web development fast, intuitive, and enjoyable. It combines the best of modern web technologies in the BETH stack:

- **B**un - A fast JavaScript runtime and package manager
- **E**lysia - A TypeScript web framework for Bun
- **T**urso - SQLite database for the edge
- **H**TMX - HTML extensions for dynamic content

</GlassyCard>

## Why Elysium-js?

Elysium-js provides a complete solution for building web applications with a focus on developer experience, performance, and scalability. It combines the best tools in the JavaScript ecosystem to create a framework that is both powerful and easy to use.

## Key Features

<div class="features-grid">
  <GlassyCard title="SvelteKit-Inspired Structure" icon="📂">
    Elysium-js follows a project structure similar to SvelteKit, making it intuitive for developers familiar with modern frameworks.
  </GlassyCard>

  <GlassyCard title="TypeScript Support" icon="📝">
    Built with TypeScript from the ground up, providing type safety throughout your application.
  </GlassyCard>

  <GlassyCard title="HTMX Integration" icon="🔄">
    Seamless integration with HTMX for dynamic content without complex JavaScript.
  </GlassyCard>

  <GlassyCard title="Database Options" icon="💾">
    Support for multiple database options, including Turso, Prisma, and Drizzle.
  </GlassyCard>
</div>

## Philosophy

Elysium-js is built on the following principles:

1. **Simplicity**: The framework should be easy to learn and use.
2. **Performance**: Applications should be fast by default.
3. **Developer Experience**: Development should be enjoyable and productive.
4. **Flexibility**: The framework should be adaptable to different use cases.

## When to Use Elysium-js

Elysium-js is ideal for:

- Full-stack web applications
- Projects that need to be deployed globally
- Applications that require a balance of performance and developer experience
- Teams that prefer a more traditional server-rendered approach with modern enhancements

## Comparison with Other Frameworks

<div class="comparison-table">

| Feature | Elysium-js | Next.js | SvelteKit |
|---------|------------|---------|-----------|
| Runtime | Bun | Node.js | Node.js |
| Rendering | Server-side | Server/Client | Server/Client |
| Data Fetching | Server-side | Server/Client | Server/Client |
| Database | Turso, Prisma, Drizzle | Any | Any |
| UI Updates | HTMX | React | Svelte |
| File-based Routing | ✅ | ✅ | ✅ |
| TypeScript | ✅ | ✅ | ✅ |
| Bundle Size | Small | Large | Small |
| Learning Curve | Moderate | Steep | Moderate |

</div>

<style>
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.comparison-table {
  margin: 30px 0;
}

/* Glassy table styling */
.comparison-table table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 8px 32px 0 rgba(139, 92, 246, 0.15);
}

.comparison-table th {
  background: rgba(139, 92, 246, 0.1);
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
}

.comparison-table td {
  padding: 12px 16px;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

.comparison-table tr:nth-child(even) {
  background: rgba(139, 92, 246, 0.03);
}
</style>

## Next Steps

Ready to get started with Elysium-js? Check out the [Getting Started](/guide/getting-started) guide to create your first Elysium-js application.
