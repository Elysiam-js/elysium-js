import { Elysia } from 'elysia';

/**
 * API routes for the application
 * @param app Elysia application instance
 */
export default function(app: Elysia) {
  // Hello endpoint
  app.get('/hello', ({ success }) => {
    return success({
      message: 'Hello from Elysium.js API!',
      timestamp: new Date().toISOString()
    }, 'Hello endpoint called successfully');
  });
  
  // Echo endpoint
  app.post('/echo', ({ body, success }) => {
    return success({
      echo: body,
      received: new Date().toISOString()
    }, 'Echo endpoint called successfully');
  });
  
  // Status endpoint
  app.get('/status', ({ success }) => {
    return success({
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }, 'System is online');
  });
  
  return app;
}
