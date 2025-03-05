/**
 * CORS Plugin for Elysium.js
 * 
 * Provides Cross-Origin Resource Sharing (CORS) protection for your Elysia application
 */

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

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
  
  return app.use(
    cors({
      origin,
      methods,
      allowedHeaders,
      exposedHeaders,
      credentials,
      maxAge,
    })
  );
}

export default { setupCors };
