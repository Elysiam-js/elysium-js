import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { todos, Todo } from '../../models/todo';
import { eq } from 'drizzle-orm';

// Todo component for HTMX rendering
const TodoItem = (todo: Todo) => {
  return (
    <div 
      class="flex justify-between items-center p-3 bg-gray-50 rounded-md group"
      id={`todo-${todo.id}`}
    >
      <div class="flex items-center gap-3">
        <input 
          type="checkbox" 
          class="w-5 h-5 accent-blue-600"
          checked={todo.completed}
          hx-put={`/api/todos/${todo.id}`}
          hx-vals={`{"completed": ${!todo.completed}}`}
          hx-target={`#todo-${todo.id}`}
          hx-swap="outerHTML"
        />
        <p class={`text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
          {todo.content}
        </p>
      </div>
      <button 
        class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        hx-delete={`/api/todos/${todo.id}`}
        hx-target={`#todo-${todo.id}`}
        hx-swap="outerHTML"
        hx-confirm="Are you sure you want to delete this todo?"
      >
        Delete
      </button>
    </div>
  );
};

// Todo routes with CRUD operations
export const todoRoutes = new Elysia({ prefix: '/todos' })
  // Get all todos
  .get('/', async ({ html }) => {
    try {
      const allTodos = await db.select().from(todos).orderBy(todos.createdAt);
      
      return allTodos.map(todo => TodoItem(todo));
    } catch (error) {
      console.error('Error fetching todos:', error);
      return html(
        <div class="p-3 bg-red-100 text-red-700 rounded-md">
          Failed to load todos. Please try again.
        </div>
      );
    }
  })
  
  // Get todo by ID
  .get('/:id', async ({ params, html }) => {
    try {
      const todo = await db.select().from(todos).where(eq(todos.id, +params.id)).limit(1);
      
      if (todo.length === 0) {
        return html(
          <div class="p-3 bg-yellow-100 text-yellow-700 rounded-md">
            Todo not found.
          </div>
        );
      }
      
      return TodoItem(todo[0]);
    } catch (error) {
      console.error(`Error fetching todo ${params.id}:`, error);
      return html(
        <div class="p-3 bg-red-100 text-red-700 rounded-md">
          Failed to load todo. Please try again.
        </div>
      );
    }
  })
  
  // Create a new todo
  .post('/', async ({ body, html }) => {
    try {
      const [createdTodo] = await db.insert(todos).values({
        content: body.content,
        completed: false
      }).returning();
      
      return TodoItem(createdTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
      return html(
        <div class="p-3 bg-red-100 text-red-700 rounded-md">
          Failed to create todo. Please try again.
        </div>
      );
    }
  }, {
    body: t.Object({
      content: t.String()
    })
  })
  
  // Update a todo
  .put('/:id', async ({ params, body, html }) => {
    try {
      const [updatedTodo] = await db
        .update(todos)
        .set({ 
          completed: body.completed !== undefined ? body.completed : undefined,
          content: body.content !== undefined ? body.content : undefined,
          updatedAt: new Date()
        })
        .where(eq(todos.id, +params.id))
        .returning();
      
      if (!updatedTodo) {
        return html(
          <div class="p-3 bg-yellow-100 text-yellow-700 rounded-md">
            Todo not found.
          </div>
        );
      }
      
      return TodoItem(updatedTodo);
    } catch (error) {
      console.error(`Error updating todo ${params.id}:`, error);
      return html(
        <div class="p-3 bg-red-100 text-red-700 rounded-md">
          Failed to update todo. Please try again.
        </div>
      );
    }
  }, {
    body: t.Object({
      completed: t.Optional(t.Boolean()),
      content: t.Optional(t.String())
    })
  })
  
  // Delete a todo
  .delete('/:id', async ({ params, html }) => {
    try {
      await db.delete(todos).where(eq(todos.id, +params.id));
      
      // Return empty string as the element will be removed from the DOM
      return '';
    } catch (error) {
      console.error(`Error deleting todo ${params.id}:`, error);
      return html(
        <div class="p-3 bg-red-100 text-red-700 rounded-md">
          Failed to delete todo. Please try again.
        </div>
      );
    }
  });
