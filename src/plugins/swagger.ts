/**
 * Swagger Plugin for Elysium.js
 * 
 * Automatically generates Swagger/OpenAPI documentation from your Elysia routes
 */

import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';

/**
 * Configure Swagger UI for Elysium.js
 * 
 * @param app - The Elysia application instance
 * @param options - Configuration options for Swagger
 * @returns The Elysia application instance with Swagger configured
 */
export function setupSwagger(
  app: Elysia,
  options: {
    title?: string;
    version?: string;
    description?: string;
    path?: string;
  } = {}
) {
  const {
    title = 'Elysium.js API',
    version = '1.0.0',
    description = 'API documentation for Elysium.js application',
    path = '/swagger'
  } = options;
  
  return app.use(
    swagger({
      documentation: {
        info: {
          title,
          version,
          description,
        },
        tags: [
          { name: 'API', description: 'API endpoints' },
          { name: 'Pages', description: 'Page routes' },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      path,
    })
  );
}

/**
 * Decorator for adding Swagger documentation to routes
 * 
 * @param documentation - Swagger documentation for the route
 * @returns A decorator function for Elysia routes
 */
export function apiDoc(documentation: Record<string, any>) {
  return (app: Elysia) => app.detail(documentation);
}

export default { setupSwagger, apiDoc };
