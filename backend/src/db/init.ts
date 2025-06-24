import type { Env } from '../types';
import { seedInitialUser } from './auth';

/**
 * Initialize the database with required tables and seed data
 */
export async function initializeDatabase(env: Env): Promise<void> {
  try {
    console.log('Initializing database...');
    
    // Create tables if they don't exist (for local development)
    await createTables(env.DB);
    
    // Seed the initial user
    await seedInitialUser(env.DB);
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

/**
 * Create database tables if they don't exist
 */
async function createTables(db: D1Database): Promise<void> {
  try {
    // Create users table - using single line SQL to avoid parsing issues
    const createUsersSQL = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime(\'now\')))';
    await db.prepare(createUsersSQL).run();

    // Create index on username for fast lookups
    const createIndexSQL = 'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)';
    await db.prepare(createIndexSQL).run();

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Failed to create database tables:', error);
    throw error;
  }
}

/**
 * Check if the database is properly initialized
 */
export async function checkDatabaseHealth(db: D1Database): Promise<boolean> {
  try {
    // Check if users table exists
    const result = await db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    ).first();
    
    return result !== null;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}