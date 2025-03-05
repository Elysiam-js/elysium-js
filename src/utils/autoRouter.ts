import { Elysia } from 'elysia';
import fs from 'fs';
import path from 'path';
import { logger } from '../plugins/logger';

// Processor type for handling different file extensions
export type FileProcessor = (filePath: string, content: string) => any;

// Auto router options
export interface AutoRouterOptions {
  dir: string;
  processors?: Record<string, FileProcessor>;
  baseRoute?: string;
}

/**
 * Automatically registers routes based on file system structure
 * @param app Elysia application instance
 * @param options Auto router options
 * @returns Elysia application instance with routes
 */
export function autoRouter(app: Elysia, options: AutoRouterOptions): Elysia {
  const { dir, processors = {}, baseRoute = '' } = options;
  
  // Check if directory exists
  if (!fs.existsSync(dir)) {
    logger.warn(`Routes directory '${dir}' does not exist. Skipping auto-routing.`);
    return app;
  }
  
  // Process routes recursively
  processDirectory(app, dir, baseRoute, processors);
  
  return app;
}

/**
 * Process a directory to find route files
 * @param app Elysia application instance
 * @param dirPath Directory path
 * @param routePrefix Route prefix
 * @param processors File processors
 */
function processDirectory(
  app: Elysia,
  dirPath: string,
  routePrefix: string,
  processors: Record<string, FileProcessor>
) {
  const items = fs.readdirSync(dirPath);
  
  // Process each item in the directory
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Handle directory
      const newRoutePrefix = item.startsWith('[') && item.endsWith(']')
        ? `${routePrefix}/:${item.slice(1, -1)}`  // Dynamic route parameter
        : `${routePrefix}/${item === 'routes' ? '' : item}`;
      
      processDirectory(app, itemPath, newRoutePrefix, processors);
    } else {
      // Handle file
      processFile(app, itemPath, routePrefix, processors);
    }
  }
}

/**
 * Process a file to register as a route
 * @param app Elysia application instance
 * @param filePath File path
 * @param routePrefix Route prefix
 * @param processors File processors
 */
function processFile(
  app: Elysia,
  filePath: string,
  routePrefix: string,
  processors: Record<string, FileProcessor>
) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath);
  const processor = processors[ext];
  
  // Special files
  if (fileName === '+page.els' || fileName === 'index.els') {
    // Page route
    const content = fs.readFileSync(filePath, 'utf-8');
    const handler = processor ? processor(filePath, content) : content;
    
    app.get(routePrefix || '/', handler);
    logger.debug(`Registered page route: ${routePrefix || '/'}`);
  } else if (fileName === '+layout.els') {
    // Layout route - handled by component system
    logger.debug(`Found layout: ${routePrefix}`);
  } else if (fileName === '+server.ts' || fileName === '+api.ts') {
    // API route
    const apiModule = require(filePath).default;
    
    if (typeof apiModule === 'function') {
      apiModule(app.group(routePrefix));
      logger.debug(`Registered API route group: ${routePrefix}`);
    }
  } else if (fileName.startsWith('+') && fileName.endsWith('.ts')) {
    // Other server files like +page.server.ts
    logger.debug(`Found server file: ${filePath}`);
  } else if (!fileName.startsWith('.') && !fileName.startsWith('_')) {
    // Regular file that's not hidden or prefixed with underscore
    const baseName = path.basename(fileName, ext);
    
    if (baseName !== 'index' && !baseName.startsWith('+')) {
      const routePath = `${routePrefix}/${baseName}`;
      
      if (ext === '.els' && processor) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const handler = processor(filePath, content);
        
        app.get(routePath, handler);
        logger.debug(`Registered component route: ${routePath}`);
      }
    }
  }
}

export default autoRouter;
