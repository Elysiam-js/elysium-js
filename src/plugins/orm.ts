/**
 * ORM Integration Plugin for Elysium.js
 * 
 * Provides integration with popular ORMs: Turso, Prisma, and Drizzle
 */

import { Elysia } from 'elysia';
import { logger } from './logger';

// ORM Types
export type OrmType = 'turso' | 'prisma' | 'drizzle';

/**
 * Turso Database Integration
 */
export async function setupTurso(config: any = {}) {
  try {
    const { createClient } = await import('@libsql/client');
    
    const client = createClient({
      url: process.env.DATABASE_URL || config.url || 'file:./data.db',
      authToken: process.env.DATABASE_AUTH_TOKEN || config.authToken,
    });
    
    logger.info('Turso database connection established');
    
    return (app: Elysia) => app.state('db', client);
  } catch (error) {
    logger.error('Failed to initialize Turso database:', error);
    throw error;
  }
}

/**
 * Prisma ORM Integration
 */
export async function setupPrisma(config: any = {}) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    
    const prisma = new PrismaClient(config);
    
    // Connect to the database
    await prisma.$connect();
    
    logger.info('Prisma ORM connection established');
    
    // Add cleanup on process exit
    process.on('beforeExit', async () => {
      await prisma.$disconnect();
      logger.info('Prisma ORM connection closed');
    });
    
    return (app: Elysia) => app.state('db', prisma);
  } catch (error) {
    logger.error('Failed to initialize Prisma ORM:', error);
    throw error;
  }
}

/**
 * Drizzle ORM Integration
 */
export async function setupDrizzle(config: any = {}) {
  try {
    const { drizzle } = await import('drizzle-orm');
    
    let client;
    let db;
    
    // SQLite (default)
    if (!config.type || config.type === 'sqlite') {
      const { createClient } = await import('@libsql/client');
      client = createClient({
        url: process.env.DATABASE_URL || config.url || 'file:./data.db',
        authToken: process.env.DATABASE_AUTH_TOKEN || config.authToken,
      });
      
      const { drizzle: drizzleSqlite } = await import('drizzle-orm/libsql');
      db = drizzleSqlite(client);
    } 
    // PostgreSQL
    else if (config.type === 'postgres') {
      const { Pool } = await import('pg');
      client = new Pool({
        connectionString: process.env.DATABASE_URL || config.url,
        ...config.options,
      });
      
      const { drizzle: drizzlePg } = await import('drizzle-orm/pg-pool');
      db = drizzlePg(client);
    }
    // MySQL
    else if (config.type === 'mysql') {
      const mysql = await import('mysql2/promise');
      client = mysql.createPool({
        uri: process.env.DATABASE_URL || config.url,
        ...config.options,
      });
      
      const { drizzle: drizzleMysql } = await import('drizzle-orm/mysql2');
      db = drizzleMysql(client);
    }
    else {
      throw new Error(`Unsupported database type: ${config.type}`);
    }
    
    logger.info(`Drizzle ORM connection established (${config.type || 'sqlite'})`);
    
    return (app: Elysia) => app.state('db', db);
  } catch (error) {
    logger.error('Failed to initialize Drizzle ORM:', error);
    throw error;
  }
}

/**
 * Setup ORM based on type
 */
export async function setupOrm(type: OrmType, config: any = {}) {
  switch (type) {
    case 'turso':
      return setupTurso(config);
    case 'prisma':
      return setupPrisma(config);
    case 'drizzle':
      return setupDrizzle(config);
    default:
      throw new Error(`Unsupported ORM type: ${type}`);
  }
}

export default { setupOrm, setupTurso, setupPrisma, setupDrizzle };
