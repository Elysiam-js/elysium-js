/**
 * Todo model for the application
 */
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Todo creation data transfer object
 */
export interface CreateTodoDto {
  title: string;
  completed?: boolean;
}

/**
 * Todo update data transfer object
 */
export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
}

/**
 * In-memory todo store for demo purposes
 * In a real application, this would be replaced with a database
 */
class TodoStore {
  private todos: Todo[] = [];
  private nextId = 1;
  
  /**
   * Get all todos
   * @returns Array of todos
   */
  getAll(): Todo[] {
    return [...this.todos];
  }
  
  /**
   * Get a todo by ID
   * @param id Todo ID
   * @returns Todo or undefined if not found
   */
  getById(id: number): Todo | undefined {
    return this.todos.find(todo => todo.id === id);
  }
  
  /**
   * Create a new todo
   * @param data Todo creation data
   * @returns Created todo
   */
  create(data: CreateTodoDto): Todo {
    const now = new Date();
    const todo: Todo = {
      id: this.nextId++,
      title: data.title,
      completed: data.completed ?? false,
      createdAt: now,
      updatedAt: now
    };
    
    this.todos.push(todo);
    return todo;
  }
  
  /**
   * Update a todo
   * @param id Todo ID
   * @param data Todo update data
   * @returns Updated todo or undefined if not found
   */
  update(id: number, data: UpdateTodoDto): Todo | undefined {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return undefined;
    
    const todo = this.todos[index];
    const updatedTodo: Todo = {
      ...todo,
      ...data,
      updatedAt: new Date()
    };
    
    this.todos[index] = updatedTodo;
    return updatedTodo;
  }
  
  /**
   * Delete a todo
   * @param id Todo ID
   * @returns True if deleted, false if not found
   */
  delete(id: number): boolean {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;
    
    this.todos.splice(index, 1);
    return true;
  }
}

// Export singleton instance
export const todoStore = new TodoStore();
