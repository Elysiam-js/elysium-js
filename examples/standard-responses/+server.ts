import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.group('/api/examples/responses', (app) =>
    app
      .get('/success', ({ success }) => {
        const data = {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        };
        
        return success(data, 'User retrieved successfully');
      })
      .post('/created', ({ body, created }) => {
        // Simulate creating a new resource
        const newResource = {
          id: Math.floor(Math.random() * 1000),
          ...body
        };
        
        return created(newResource, 'Resource created successfully');
      })
      .post('/accepted', ({ accepted }) => {
        // Simulate starting a background task
        setTimeout(() => {
          console.log('Background task completed');
        }, 5000);
        
        return accepted('Your request is being processed');
      })
      .delete('/no-content/:id', ({ params, noContent }) => {
        // Simulate deleting a resource
        console.log(`Deleting resource with ID: ${params.id}`);
        
        return noContent();
      })
  );
