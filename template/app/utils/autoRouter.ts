import { Elysia } from 'elysia';
import { readdirSync, statSync } from 'fs';
import { join, parse, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Root directory for routes
const ROUTES_DIR = join(__dirname, '../routes');

interface RouteFile {
  path: string;
  relativePath: string;
  isDirectory: boolean;
}

/**
 * Recursively scans the routes directory to find all route files
 */
function scanRouteFiles(dir: string = ROUTES_DIR): RouteFile[] {
  const files: RouteFile[] = [];
  
  try {
    readdirSync(dir).forEach(file => {
      const filePath = join(dir, file);
      const isDirectory = statSync(filePath).isDirectory();
      
      // Skip node_modules and hidden directories
      if (file.startsWith('node_modules') || file.startsWith('.')) {
        return;
      }
      
      // If it's a directory, scan it recursively
      if (isDirectory) {
        files.push({ 
          path: filePath, 
          relativePath: relative(ROUTES_DIR, filePath),
          isDirectory 
        });
        files.push(...scanRouteFiles(filePath));
      } 
      // Only include TypeScript files
      else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        files.push({ 
          path: filePath, 
          relativePath: relative(ROUTES_DIR, filePath),
          isDirectory 
        });
      }
    });
  } catch (error) {
    console.error(`Error scanning route directory: ${dir}`, error);
  }
  
  return files;
}

/**
 * Converts file path to route path
 */
function filePathToRoutePath(filePath: string): string {
  const { dir, name } = parse(filePath);
  
  // Handle index files
  if (name === 'index') {
    return dir ? `/${dir}` : '/';
  }
  
  // Handle dynamic route parameters [param]
  const path = dir ? `/${dir}/${name}` : `/${name}`;
  return path.replace(/\[([^\]]+)\]/g, ':$1').replace(/\/+/g, '/');
}

/**
 * Automatically registers routes from the routes directory
 */
export async function setupAutoRouter(): Promise<Elysia> {
  const router = new Elysia();
  const routeFiles = scanRouteFiles();
  
  // First, handle API routes
  const apiRoutes = routeFiles.filter(file => 
    !file.isDirectory && file.relativePath.includes('api') && !file.path.endsWith('index.ts')
  );
  
  for (const routeFile of apiRoutes) {
    try {
      const routeModule = await import(routeFile.path);
      if (routeModule && typeof routeModule.default === 'function') {
        const routePath = filePathToRoutePath(routeFile.relativePath);
        router.group(routePath, app => app.use(routeModule.default));
      }
    } catch (error) {
      console.error(`Error loading API route: ${routeFile.path}`, error);
    }
  }
  
  // Then, handle page routes
  const pageRoutes = routeFiles.filter(file => 
    !file.isDirectory && !file.relativePath.includes('api')
  );
  
  for (const routeFile of pageRoutes) {
    try {
      const routeModule = await import(routeFile.path);
      
      // Check if the file exports a component or a route handler
      if (routeModule) {
        const routePath = filePathToRoutePath(routeFile.relativePath);
        
        // If it's a page component
        if (routeModule.default) {
          router.get(routePath, async ({ html, params, query }) => {
            const PageComponent = routeModule.default;
            const Layout = routeModule.Layout || (async () => {
              try {
                const { default: BaseLayout } = await import('../layouts/BaseLayout');
                return BaseLayout;
              } catch (error) {
                console.error('Error loading BaseLayout:', error);
                return ({ children }) => <>{children}</>;
              }
            })();
            
            const LayoutComponent = await Layout();
            
            return html(
              <LayoutComponent>
                {typeof PageComponent === 'function' 
                  ? PageComponent({ params, query }) 
                  : <PageComponent params={params} query={query} />}
              </LayoutComponent>
            );
          });
        }
      }
    } catch (error) {
      console.error(`Error loading page route: ${routeFile.path}`, error);
    }
  }
  
  return router;
}
