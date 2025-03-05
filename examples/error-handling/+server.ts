import { Elysia } from 'elysia';
import { error } from '../../src/plugins/errors';

export default (app: Elysia) =>
  app.group('/api/examples/error', (app) =>
    app
      .get('/badRequest', () => {
        throw error.BadRequest('Invalid request parameters');
      })
      .get('/unauthorized', () => {
        throw error.Unauthorized('Authentication required');
      })
      .get('/forbidden', () => {
        throw error.Forbidden('You do not have permission to access this resource');
      })
      .get('/notFound', () => {
        throw error.NotFound('The requested resource was not found');
      })
      .get('/conflict', () => {
        throw error.Conflict('The request conflicts with the current state of the server');
      })
      .get('/serverError', () => {
        throw error.InternalServerError('An unexpected error occurred on the server');
      })
      .get('/:type', ({ params }) => {
        const { type } = params;
        
        switch (type) {
          case 'badRequest':
            throw error.BadRequest('Invalid request parameters');
          case 'unauthorized':
            throw error.Unauthorized('Authentication required');
          case 'forbidden':
            throw error.Forbidden('You do not have permission to access this resource');
          case 'notFound':
            throw error.NotFound('The requested resource was not found');
          case 'conflict':
            throw error.Conflict('The request conflicts with the current state of the server');
          case 'serverError':
            throw error.InternalServerError('An unexpected error occurred on the server');
          default:
            return { message: 'No error triggered' };
        }
      })
  );
