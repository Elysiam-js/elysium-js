/**
 * Swagger Plugin for Elysium.js
 * 
 * Automatically generates Swagger/OpenAPI documentation from your Elysia routes
 */

import { Elysia } from 'elysia';

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
  
  // Simple Swagger UI HTML template
  const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui.css" />
  <style>
    body { margin: 0; padding: 0; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 20px 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: "${path}/json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>
  `;
  
  // Generate OpenAPI spec from routes
  const generateOpenApiSpec = (app: Elysia) => {
    const paths: Record<string, any> = {};
    
    // Extract route information
    app.routes.forEach(route => {
      const { path, method } = route;
      
      // Skip swagger routes
      if (path.startsWith(options.path || '/swagger')) {
        return;
      }
      
      // Initialize path object if it doesn't exist
      if (!paths[path]) {
        paths[path] = {};
      }
      
      // Add method to path
      paths[path][method.toLowerCase()] = {
        summary: route.schema?.detail?.summary || `${method} ${path}`,
        description: route.schema?.detail?.description || '',
        tags: route.schema?.detail?.tags || ['API'],
        responses: {
          '200': {
            description: 'Successful operation'
          }
        }
      };
    });
    
    // Return OpenAPI spec
    return {
      openapi: '3.0.0',
      info: {
        title,
        version,
        description
      },
      paths,
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    };
  };
  
  // Serve Swagger UI and JSON
  return app
    .get(path, () => Response.html(swaggerHtml))
    .get(`${path}/json`, ({ store }) => {
      return generateOpenApiSpec(app);
    });
}

/**
 * Decorator for adding Swagger documentation to routes
 * 
 * @param documentation - Swagger documentation for the route
 * @returns A decorator function for Elysia routes
 */
export function apiDoc(documentation: Record<string, any>) {
  return (app: Elysia) => {
    return app.detail(documentation);
  };
}

export default { setupSwagger, apiDoc };
