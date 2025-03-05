# Elysium.js CLI Tool

The Elysium.js CLI tool (`els`) helps you quickly generate components, pages, API endpoints, and models for your Elysium.js application.

## Installation

To install the CLI tool globally, run:

```bash
npm install -g elysium-js
```

Or, if you're using Bun:

```bash
bun install -g elysium-js
```

## Usage

```bash
els generate <type> <name>
```

Or use the shorthand:

```bash
els g <type> <name>
```

### Types

- `page` (or `p`): Generate a page component
- `api` (or `a`): Generate an API endpoint
- `model` (or `m`): Generate a data model
- `resource` (or `r`): Generate a complete resource (model, API, and page)

### Examples

Generate a page:
```bash
els generate page about
```

Generate an API endpoint:
```bash
els g api users
```

Generate a model:
```bash
els g model product
```

Generate a complete resource:
```bash
els g resource blog
```

## Generated Files

### Page

When generating a page, a file will be created at `app/routes/<name>/+page.els` with a basic page template.

### API Endpoint

When generating an API endpoint, a file will be created at `app/routes/api/<name>/+server.ts` with CRUD endpoints.

### Model

When generating a model, a file will be created at `app/models/<name>.ts` with a basic model definition and an in-memory store.

### Resource

When generating a resource, all three files mentioned above will be created.

## Manual Installation

If you're developing the Elysium.js framework itself, you can link the CLI tool locally:

1. Navigate to the Elysium.js directory
2. Run `npm link` or `bun link`
3. Now you can use the `els` command from anywhere

## Customizing Templates

The CLI tool uses templates located in the `templates` directory. You can customize these templates to fit your project's needs.

- `page.template`: Template for page components
- `api.template`: Template for API endpoints
- `model.template`: Template for data models

The templates use a simple variable replacement system with `{{variable}}` syntax.
