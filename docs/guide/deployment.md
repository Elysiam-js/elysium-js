# Deployment

This guide covers how to deploy your Elysium-js application to production environments.

## Building for Production

Before deploying your application, you need to build it for production:

```bash
bun run build
```

This command runs the build script defined in your `package.json`, which creates a production build in the `dist` directory.

## Running in Production

To run your application in production:

```bash
bun run start
```

This command starts your application using the production build.

## Deploying to Hosting Platforms

### Fly.io

[Fly.io](https://fly.io/) is a platform that lets you deploy applications globally.

#### Prerequisites

1. Install the Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Log in to Fly:
   ```bash
   fly auth login
   ```

#### Deployment Steps

1. Create a `fly.toml` file in your project root:

```toml
app = "your-app-name"

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 3000
  force_https = true
```

2. Create a `Dockerfile`:

```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --production

COPY . .
RUN bun run build

ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "start"]
```

3. Deploy your application:

```bash
fly launch
```

4. Visit your application at `https://your-app-name.fly.dev`

### Railway

[Railway](https://railway.app/) is a platform that makes it easy to deploy applications.

#### Deployment Steps

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add the following environment variables:
   - `PORT=3000`
   - Any database credentials or API keys

Railway will automatically detect your `package.json` and build/deploy your application.

### Vercel

[Vercel](https://vercel.com/) is a platform for frontend frameworks and static sites.

#### Deployment Steps

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Create a `vercel.json` file:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/index.ts"
       }
     ]
   }
   ```

4. Deploy your application:
   ```bash
   vercel
   ```

## Environment Variables

In production, you should use environment variables for sensitive information like database credentials and API keys.

### Setting Environment Variables

#### Fly.io

```bash
fly secrets set TURSO_DATABASE_URL=libsql://your-database.turso.io
fly secrets set TURSO_AUTH_TOKEN=your-auth-token
```

#### Railway

Set environment variables in the Railway dashboard.

#### Vercel

Set environment variables in the Vercel dashboard or using the CLI:

```bash
vercel env add TURSO_DATABASE_URL
```

### Accessing Environment Variables

In your application, you can access environment variables using `process.env`:

```typescript
// src/index.ts
import { config } from 'dotenv';
config();

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
```

## Database Deployment

### Turso

[Turso](https://turso.tech/) is a distributed database built on libSQL, a fork of SQLite. It's designed for edge computing and is a perfect fit for Elysium-js applications.

#### Setting Up Turso

1. Install the Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. Log in to Turso:
   ```bash
   turso auth login
   ```

3. Create a database:
   ```bash
   turso db create my-database
   ```

4. Get the database URL and auth token:
   ```bash
   turso db show my-database --url
   turso db tokens create my-database
   ```

5. Set these as environment variables in your deployment platform.

## SSL/TLS

Most deployment platforms handle SSL/TLS certificates automatically. If you're deploying to your own server, you'll need to set up SSL/TLS certificates.

### Setting Up SSL/TLS with Let's Encrypt

1. Install Certbot:
   ```bash
   apt-get update
   apt-get install certbot
   ```

2. Generate certificates:
   ```bash
   certbot certonly --standalone -d yourdomain.com
   ```

3. Configure your web server to use the certificates.

## Monitoring and Logging

### Setting Up Monitoring

You can use services like [Datadog](https://www.datadoghq.com/), [New Relic](https://newrelic.com/), or [Sentry](https://sentry.io/) to monitor your application.

#### Sentry Example

1. Install Sentry:
   ```bash
   bun add @sentry/node
   ```

2. Initialize Sentry in your application:
   ```typescript
   // src/index.ts
   import * as Sentry from '@sentry/node';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV || 'development'
   });

   // Rest of your application
   ```

### Logging

For logging, you can use services like [Logtail](https://betterstack.com/logtail) or [Papertrail](https://www.papertrail.com/).

#### Logtail Example

1. Install Logtail:
   ```bash
   bun add @logtail/node
   ```

2. Initialize Logtail in your application:
   ```typescript
   // src/index.ts
   import { Logtail } from '@logtail/node';

   const logtail = new Logtail(process.env.LOGTAIL_TOKEN);

   // Use logtail for logging
   logtail.info('Application started');

   // Rest of your application
   ```

## CI/CD

Setting up continuous integration and deployment (CI/CD) can help automate your deployment process.

### GitHub Actions

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - name: Install dependencies
        run: bun install
      - name: Build
        run: bun run build
      - name: Deploy to Fly.io
        uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

## Best Practices

- Use environment variables for sensitive information
- Set up monitoring and logging
- Use a CI/CD pipeline for automated deployments
- Use a CDN for static assets
- Set up automatic database backups
- Use a staging environment for testing before production
- Implement health checks for your application
