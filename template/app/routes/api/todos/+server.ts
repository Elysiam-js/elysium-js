import { Elysia } from 'elysia';
import { todoStore } from '../../../models/todo';

/**
 * Todo API routes
 * @param app Elysia application instance
 */
export default function(app: Elysia) {
  // Get all todos
  app.get('/', ({ success }) => {
    const todos = todoStore.getAll();
    return success(todos, 'Todos retrieved successfully');
  });
  
  // Get todo by ID
  app.get('/:id', ({ params, success, error }) => {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      throw error.BadRequest('Invalid todo ID');
    }
    
    const todo = todoStore.getById(id);
    
    if (!todo) {
      throw error.NotFound(`Todo with ID ${id} not found`);
    }
    
    return success(todo, 'Todo retrieved successfully');
  });
  
  // Create todo
  app.post('/', ({ body, created, error }) => {
    if (!body || typeof body !== 'object') {
      throw error.BadRequest('Invalid request body');
    }
    
    if (!body.title || typeof body.title !== 'string') {
      throw error.BadRequest('Title is required and must be a string');
    }
    
    const todo = todoStore.create({
      title: body.title,
      completed: body.completed === true
    });
    
    return created(todo, 'Todo created successfully');
  });
  
  // Update todo
  app.put('/:id', ({ params, body, success, error }) => {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      throw error.BadRequest('Invalid todo ID');
    }
    
    if (!body || typeof body !== 'object') {
      throw error.BadRequest('Invalid request body');
    }
    
    // Validate fields if present
    if (body.title !== undefined && typeof body.title !== 'string') {
      throw error.BadRequest('Title must be a string');
    }
    
    if (body.completed !== undefined && typeof body.completed !== 'boolean') {
      throw error.BadRequest('Completed must be a boolean');
    }
    
    const todo = todoStore.update(id, {
      title: body.title,
      completed: body.completed
    });
    
    if (!todo) {
      throw error.NotFound(`Todo with ID ${id} not found`);
    }
    
    return success(todo, 'Todo updated successfully');
  });
  
  // Delete todo
  app.delete('/:id', ({ params, noContent, error }) => {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      throw error.BadRequest('Invalid todo ID');
    }
    
    const deleted = todoStore.delete(id);
    
    if (!deleted) {
      throw error.NotFound(`Todo with ID ${id} not found`);
    }
    
    return noContent();
  });
  
  return app;
}
