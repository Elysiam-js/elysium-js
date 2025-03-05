# Troubleshooting

<GlassyCard 
  title="Troubleshooting Your Elysium-js Application" 
  icon="🔧"
  description="Common issues and their solutions to help you debug your Elysium-js application">

Every developer encounters issues while building applications. This guide covers common problems you might face when working with Elysium-js and how to solve them.

</GlassyCard>

## Installation Issues

### Bun Installation Fails

**Problem**: You're unable to install Bun on your system.

**Solutions**:

1. **Check System Requirements**:
   - Bun supports macOS, Linux, and Windows (via WSL)
   - Ensure you have a compatible system

2. **Try Alternative Installation Methods**:
   ```bash
   # Using curl
   curl -fsSL https://bun.sh/install | bash
   
   # Using npm
   npm install -g bun
   
   # Using Homebrew (macOS)
   brew tap oven-sh/bun
   brew install bun
   ```

3. **Check for Permissions Issues**:
   ```bash
   # Run with sudo (if needed)
   sudo curl -fsSL https://bun.sh/install | bash
   ```

### Package Installation Errors

**Problem**: You're getting errors when installing packages with Bun.

**Solutions**:

1. **Update Bun**:
   ```bash
   bun upgrade
   ```

2. **Clear Bun's Cache**:
   ```bash
   rm -rf ~/.bun/install/cache
   ```

3. **Try Installing with Specific Versions**:
   ```bash
   bun add package@version
   ```

## Project Setup Issues

### Project Creation Fails

**Problem**: `bun create elysium app` fails.

**Solutions**:

1. **Check Bun Version**:
   ```bash
   bun --version
   ```
   Ensure you're using the latest version of Bun.

2. **Try Creating a Project Manually**:
   ```bash
   # Clone the template repository
   git clone https://github.com/yourusername/elysium-template my-app
   
   # Install dependencies
   cd my-app
   bun install
   ```

3. **Check Network Connectivity**:
   Ensure you have a stable internet connection to download the template.

### Missing Dependencies

**Problem**: You're getting "Module not found" errors.

**Solutions**:

1. **Install Missing Dependencies**:
   ```bash
   bun add missing-package
   ```

2. **Check `package.json`**:
   Ensure all dependencies are correctly listed in your `package.json` file.

3. **Reinstall Dependencies**:
   ```bash
   rm -rf node_modules bun.lockb
   bun install
   ```

## Runtime Issues

### Application Won't Start

**Problem**: Your application fails to start.

**Solutions**:

1. **Check Error Messages**:
   Look for specific error messages in the console.

2. **Check Port Availability**:
   ```bash
   # Check if port 3000 is in use
   lsof -i :3000
   
   # Use a different port
   PORT=3001 bun run dev
   ```

3. **Check Environment Variables**:
   Ensure all required environment variables are set.

4. **Check File Permissions**:
   Ensure your application has the necessary permissions to read/write files.

### Hot Reload Not Working

**Problem**: Changes to your code aren't reflected in the browser.

**Solutions**:

1. **Restart the Development Server**:
   ```bash
   # Stop the current server (Ctrl+C)
   # Start a new server
   bun run dev
   ```

2. **Check File Watchers**:
   Some systems have limits on file watchers. Increase the limit:
   ```bash
   # Linux
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
   ```

3. **Clear Browser Cache**:
   Use Ctrl+Shift+R to perform a hard refresh in your browser.

## Database Issues

### Database Connection Fails

**Problem**: Your application can't connect to the database.

**Solutions**:

1. **Check Connection String**:
   Ensure your database connection string is correct.

2. **Check Credentials**:
   Verify that your database username and password are correct.

3. **Check Database Availability**:
   Ensure your database server is running and accessible.

4. **Check Firewall Settings**:
   Ensure your firewall allows connections to the database.

### Migration Errors

**Problem**: Database migrations fail.

**Solutions**:

1. **Check Migration Files**:
   Ensure your migration files are correctly formatted.

2. **Run Migrations Manually**:
   ```bash
   # For Prisma
   npx prisma migrate dev
   
   # For Drizzle
   npx drizzle-kit push
   ```

3. **Reset Database (Development Only)**:
   ```bash
   # For Prisma
   npx prisma migrate reset
   
   # For Drizzle
   npx drizzle-kit drop
   ```

## Routing Issues

### Routes Not Working

**Problem**: Your routes aren't working as expected.

**Solutions**:

1. **Check Route Definitions**:
   Ensure your routes are correctly defined.

2. **Check Route Order**:
   Routes are matched in order, so more specific routes should come before more general ones.

3. **Check for Typos**:
   Ensure there are no typos in your route paths.

4. **Check Middleware**:
   Ensure middleware isn't blocking your routes.

### 404 Errors

**Problem**: You're getting 404 errors for routes that should exist.

**Solutions**:

1. **Check File Names and Paths**:
   Ensure your file names and paths match your route definitions.

2. **Check Route Registration**:
   Ensure your routes are registered in your application.

3. **Check for Dynamic Segments**:
   Ensure dynamic segments in your routes are correctly defined.

## HTMX Issues

### HTMX Not Working

**Problem**: HTMX attributes aren't triggering as expected.

**Solutions**:

1. **Check HTMX Installation**:
   Ensure HTMX is correctly included in your HTML.

2. **Check Browser Console**:
   Look for errors in the browser console.

3. **Check HTMX Attributes**:
   Ensure HTMX attributes are correctly formatted.

4. **Check Response Headers**:
   Ensure your server is sending the correct headers for HTMX.

### HTMX Swaps Not Working

**Problem**: HTMX swaps aren't working as expected.

**Solutions**:

1. **Check Swap Targets**:
   Ensure your swap targets exist in the DOM.

2. **Check Response Content**:
   Ensure your server is sending the correct HTML content.

3. **Check HTMX Events**:
   Use HTMX events for debugging:
   ```html
   <div hx-get="/api/data" hx-target="#result"
        hx-on:before-request="console.log('Before request')"
        hx-on:after-request="console.log('After request')">
     Load Data
   </div>
   ```

## TypeScript Issues

### Type Errors

**Problem**: You're getting TypeScript type errors.

**Solutions**:

1. **Check TypeScript Configuration**:
   Ensure your `tsconfig.json` is correctly configured.

2. **Add Type Definitions**:
   Add missing type definitions:
   ```bash
   bun add -d @types/missing-package
   ```

3. **Use Type Assertions**:
   Use type assertions when TypeScript can't infer types:
   ```typescript
   const value = someFunction() as ExpectedType;
   ```

### Missing Type Definitions

**Problem**: You're getting "Could not find a declaration file for module" errors.

**Solutions**:

1. **Install Type Definitions**:
   ```bash
   bun add -d @types/package
   ```

2. **Create Custom Type Definitions**:
   Create a `.d.ts` file for the module:
   ```typescript
   // types/package.d.ts
   declare module 'package' {
     // Type definitions
   }
   ```

3. **Use `any` Type (Last Resort)**:
   ```typescript
   // Add to a .d.ts file
   declare module 'package';
   ```

## Performance Issues

### Slow Application Startup

**Problem**: Your application takes a long time to start.

**Solutions**:

1. **Reduce Dependencies**:
   Remove unnecessary dependencies.

2. **Use Production Mode**:
   ```bash
   NODE_ENV=production bun run start
   ```

3. **Optimize Imports**:
   Use specific imports instead of importing entire modules:
   ```typescript
   // Good
   import { specific } from 'module';
   
   // Bad
   import * as module from 'module';
   ```

### Slow Response Times

**Problem**: Your application has slow response times.

**Solutions**:

1. **Optimize Database Queries**:
   - Use indexes
   - Limit the data returned
   - Use query caching

2. **Implement Caching**:
   ```typescript
   // Simple in-memory cache
   const cache = new Map();
   
   app.get('/api/data', async () => {
     const cacheKey = 'data';
     
     if (cache.has(cacheKey)) {
       return cache.get(cacheKey);
     }
     
     const data = await fetchData();
     cache.set(cacheKey, data);
     
     return data;
   });
   ```

3. **Use Compression**:
   ```typescript
   import { compress } from '@elysiajs/compress';
   
   app.use(compress());
   ```

## Deployment Issues

### Deployment Fails

**Problem**: Your application fails to deploy.

**Solutions**:

1. **Check Build Process**:
   Ensure your build process completes successfully.

2. **Check Environment Variables**:
   Ensure all required environment variables are set in your deployment environment.

3. **Check Platform Requirements**:
   Ensure your deployment platform supports Bun.

4. **Check Logs**:
   Check the deployment logs for specific error messages.

### Application Crashes in Production

**Problem**: Your application crashes in production.

**Solutions**:

1. **Implement Error Handling**:
   ```typescript
   app.onError(({ code, error, set }) => {
     console.error(`Error: ${code}`, error);
     
     set.status = code === 'NOT_FOUND' ? 404 : 500;
     return { error: 'Internal Server Error' };
   });
   ```

2. **Use Process Managers**:
   Use a process manager like PM2 to restart your application on crashes:
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start your application with PM2
   pm2 start bun --name "elysium" -- run start
   ```

3. **Implement Monitoring**:
   Use a monitoring service to track errors and performance in production.

## Common Error Messages

### "Cannot find module"

**Problem**: `Cannot find module 'module-name'`

**Solutions**:

1. **Install the Module**:
   ```bash
   bun add module-name
   ```

2. **Check Import Path**:
   Ensure the import path is correct.

3. **Check `tsconfig.json`**:
   Ensure your `tsconfig.json` is correctly configured for module resolution.

### "Port already in use"

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:

1. **Use a Different Port**:
   ```bash
   PORT=3001 bun run dev
   ```

2. **Kill the Process Using the Port**:
   ```bash
   # Find the process
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```

3. **Restart Your Computer**:
   If all else fails, restart your computer.

### "TypeScript Error"

**Problem**: `TS2322: Type 'X' is not assignable to type 'Y'`

**Solutions**:

1. **Fix the Type**:
   Ensure the value matches the expected type.

2. **Use Type Assertions**:
   ```typescript
   const value = someFunction() as ExpectedType;
   ```

3. **Update Type Definitions**:
   Update or create type definitions to match your use case.

## Getting Help

If you're still having issues, here are some resources to get help:

1. **GitHub Issues**:
   Check the [Elysium-js GitHub repository](https://github.com/yourusername/elysium-js/issues) for similar issues.

2. **Discord Community**:
   Join the Elysium-js Discord community for real-time help.

3. **Stack Overflow**:
   Ask questions on Stack Overflow with the `elysium-js` tag.

4. **Twitter**:
   Reach out to the Elysium-js team on Twitter.

## Conclusion

Troubleshooting is an essential skill for developers. By understanding common issues and their solutions, you can quickly resolve problems and continue building your Elysium-js application.
