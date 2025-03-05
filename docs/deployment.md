# Deploying Elysium.js Applications

This guide covers various deployment options for Elysium.js applications, from simple setups to more advanced configurations.

## Prerequisites

Before deploying your Elysium.js application, ensure you have:

1. Built your application for production
2. Set up environment variables
3. Configured your database
4. Tested your application locally

## Building for Production

To build your Elysium.js application for production:

```bash
# Install dependencies
bun install

# Build the application
bun run build
```

This will create optimized production files in the `dist` directory.

## Deployment Options

### 1. Deploying to Fly.io

[Fly.io](https://fly.io) is a great platform for deploying Bun applications.

#### Setup

1. Install the Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Create a `fly.toml` file in your project root:
   ```toml
   app = "your-app-name"
   primary_region = "dfw"

   [build]
     dockerfile = "Dockerfile"

   [http_service]
     internal_port = 3000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0
   ```

3. Create a `Dockerfile`:
   ```dockerfile
   FROM oven/bun:latest as builder
   WORKDIR /app
   COPY package.json bun.lockb ./
   RUN bun install --frozen-lockfile
   COPY . .
   RUN bun run build

   FROM oven/bun:latest
   WORKDIR /app
   COPY --from=builder /app/dist ./dist
   COPY --from=builder /app/package.json ./
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/public ./public

   ENV NODE_ENV=production
   EXPOSE 3000

   CMD ["bun", "dist/index.js"]
   ```

4. Deploy your application:
   ```bash
   fly launch
   ```

### 2. Deploying to Vercel

Vercel provides a seamless deployment experience for Bun applications.

#### Setup

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Create a `vercel.json` file in your project root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/index.js"
       }
     ]
   }
   ```

3. Deploy your application:
   ```bash
   vercel
   ```

### 3. Deploying to Railway

[Railway](https://railway.app) is a platform that makes it easy to deploy Bun applications.

#### Setup

1. Install the Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Create a new project:
   ```bash
   railway init
   ```

4. Deploy your application:
   ```bash
   railway up
   ```

### 4. Deploying to a VPS (Digital Ocean, AWS, etc.)

For more control, you can deploy to a Virtual Private Server.

#### Setup

1. SSH into your server:
   ```bash
   ssh user@your-server-ip
   ```

2. Install Bun:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. Clone your repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

4. Install dependencies and build:
   ```bash
   bun install
   bun run build
   ```

5. Set up a process manager (PM2):
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name "elysium-app"
   pm2 save
   pm2 startup
   ```

6. Set up Nginx as a reverse proxy:
   ```
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

7. Set up SSL with Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### 5. Deploying with Docker

Docker provides a consistent deployment environment.

#### Setup

1. Create a `Dockerfile` in your project root:
   ```dockerfile
   FROM oven/bun:latest as builder
   WORKDIR /app
   COPY package.json bun.lockb ./
   RUN bun install --frozen-lockfile
   COPY . .
   RUN bun run build

   FROM oven/bun:latest
   WORKDIR /app
   COPY --from=builder /app/dist ./dist
   COPY --from=builder /app/package.json ./
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/public ./public

   ENV NODE_ENV=production
   EXPOSE 3000

   CMD ["bun", "dist/index.js"]
   ```

2. Create a `.dockerignore` file:
   ```
   node_modules
   npm-debug.log
   dist
   .git
   .env
   .env.local
   ```

3. Build and run your Docker image:
   ```bash
   docker build -t elysium-app .
   docker run -p 3000:3000 elysium-app
   ```

## Environment Variables

### Production Environment Variables

For production, set your environment variables according to your deployment platform:

#### Fly.io

```bash
fly secrets set DATABASE_URL=your-database-url
fly secrets set JWT_SECRET=your-jwt-secret
```

#### Vercel

Set environment variables in the Vercel dashboard or using the CLI:

```bash
vercel env add DATABASE_URL
```

#### Railway

Set environment variables in the Railway dashboard or using the CLI:

```bash
railway variables set DATABASE_URL=your-database-url
```

#### Docker

Pass environment variables when running the container:

```bash
docker run -p 3000:3000 -e DATABASE_URL=your-database-url elysium-app
```

## Database Deployment

### Turso

For Turso databases:

1. Create a Turso database:
   ```bash
   turso db create your-db-name
   ```

2. Get the database URL and token:
   ```bash
   turso db show your-db-name --url
   turso db tokens create your-db-name
   ```

3. Set environment variables:
   ```
   DATABASE_URL=libsql://your-database.turso.io
   DATABASE_AUTH_TOKEN=your-auth-token
   ```

### Prisma

For Prisma databases:

1. Set the database URL in your environment variables
2. Run migrations in production:
   ```bash
   npx prisma migrate deploy
   ```

### Drizzle

For Drizzle databases:

1. Set the database URL in your environment variables
2. Run migrations in production:
   ```bash
   npx drizzle-kit push:pg
   ```

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        
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

## Monitoring and Logging

### Setting Up Monitoring

1. Add a health check endpoint to your application:
   ```typescript
   app.get('/health', () => ({ status: 'ok' }));
   ```

2. Set up Uptime Robot or similar service to monitor your health endpoint

### Logging in Production

Configure your logging for production:

```typescript
import { createElysium } from 'elysium-js';

const app = createElysium({
  logging: {
    level: 'info',
    format: 'json',
    destination: process.env.LOG_FILE || 'stdout'
  }
});
```

## Performance Optimization

### Caching

Implement caching for frequently accessed data:

```typescript
import { Elysia } from 'elysia';
import { createElysium } from 'elysium-js';

const app = createElysium();

// Simple in-memory cache
const cache = new Map();

app.get('/api/data', ({ success }) => {
  if (cache.has('data')) {
    return success(cache.get('data'), 'Data retrieved from cache');
  }
  
  const data = fetchData();
  cache.set('data', data);
  
  return success(data, 'Data retrieved successfully');
});
```

### Content Compression

Enable content compression:

```typescript
import { compress } from '@elysiajs/compress';
import { createElysium } from 'elysium-js';

const app = createElysium();
app.use(compress());
```

## Security Best Practices

1. **Use HTTPS**: Always use HTTPS in production
2. **Set Security Headers**: Configure security headers
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Input Validation**: Validate all user inputs
5. **Keep Dependencies Updated**: Regularly update dependencies

## Troubleshooting

### Common Issues

1. **Application Won't Start**: Check environment variables and port configuration
2. **Database Connection Issues**: Verify database URL and credentials
3. **Memory Leaks**: Monitor memory usage and fix any leaks
4. **Performance Issues**: Implement caching and optimize database queries

## Scaling

### Horizontal Scaling

For horizontal scaling, ensure your application is stateless and use a load balancer.

### Vertical Scaling

For vertical scaling, increase the resources (CPU, memory) of your server.

## Conclusion

Deploying an Elysium.js application requires careful planning and consideration of your specific requirements. Choose the deployment option that best fits your needs, and follow best practices for security, performance, and monitoring.
