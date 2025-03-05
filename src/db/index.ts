import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models/todo.model';

// Database connection string
// In production, use environment variables for sensitive information
const connectionString = 'postgres://postgres:postgres@localhost:5432/elysium';

// Create a postgres client
const client = postgres(connectionString);

// Create a drizzle instance
export const db = drizzle(client, { schema });

// Export the schema for migrations
export { schema };
