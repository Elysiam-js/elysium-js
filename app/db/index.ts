import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../models/todo';

// Create a Turso client
// In production, use environment variables for sensitive information
const client = createClient({
  // Local development with SQLite
  url: 'file:./data.db',
  // For Turso cloud, uncomment and use your credentials
  // url: process.env.TURSO_DATABASE_URL || 'libsql://your-database.turso.io',
  // authToken: process.env.TURSO_AUTH_TOKEN
});

// Create a drizzle instance
export const db = drizzle(client, { schema });

// Export the schema for migrations
export { schema };
