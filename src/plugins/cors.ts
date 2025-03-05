/**
 * CORS Plugin for Elysium.js
 * 
 * Provides Cross-Origin Resource Sharing (CORS) protection for your Elysia application
 */

import { Elysia } from 'elysia';

/**
 * Configure CORS for Elysium.js
 * 
 * @param app - The Elysia application instance
 * @param options - Configuration options for CORS
 * @returns The Elysia application instance with CORS configured
 */
export function setupCors(
  app: Elysia,
  options: {
    origin?: string | string[] | boolean;
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  } = {}
) {
  const {
    origin = '*',
    methods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders = ['Content-Type', 'Authorization'],
    exposedHeaders = [],
    credentials = true,
    maxAge = 86400,
  } = options;
  
  // Implement CORS manually without the dependency
  return app.onRequest(({ request, set }) => {
    const requestOrigin = request.headers.get('origin');
    
    // Set CORS headers
    if (origin === '*') {
      set.headers['Access-Control-Allow-Origin'] = '*';
    } else if (typeof origin === 'string') {
      set.headers['Access-Control-Allow-Origin'] = origin;
    } else if (Array.isArray(origin) && requestOrigin) {
      if (origin.includes(requestOrigin)) {
        set.headers['Access-Control-Allow-Origin'] = requestOrigin;
      }
    }
    
    // Set other CORS headers
    set.headers['Access-Control-Allow-Methods'] = methods.join(', ');
    set.headers['Access-Control-Allow-Headers'] = allowedHeaders.join(', ');
    
    if (exposedHeaders.length > 0) {
      set.headers['Access-Control-Expose-Headers'] = exposedHeaders.join(', ');
    }
    
    if (credentials) {
      set.headers['Access-Control-Allow-Credentials'] = 'true';
    }
    
    set.headers['Access-Control-Max-Age'] = maxAge.toString();
  }).options('*', ({ set }) => {
    set.status = 204;
    return '';
  });
}

export default { setupCors };
