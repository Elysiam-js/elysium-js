import type { Config } from 'drizzle-kit';

export default {
  schema: './app/models/todo.ts',
  out: './drizzle',
  driver: 'libsql',
  dbCredentials: {
    url: 'file:./data.db',
    // For Turso cloud, uncomment and use your credentials
    // url: process.env.TURSO_DATABASE_URL || 'libsql://your-database.turso.io',
    // authToken: process.env.TURSO_AUTH_TOKEN
  },
} satisfies Config;
