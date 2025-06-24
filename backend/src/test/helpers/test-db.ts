import { D1Database } from '@cloudflare/workers-types'

/**
 * Test database utilities for isolated testing
 */
export class TestDatabase {
  private db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  /**
   * Set up test database with migrations
   */
  async setup(): Promise<void> {
    // Create test database schema using prepared statements
    const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`
    
    const createUsersIndex = `CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`

    // Execute schema creation using prepared statements
    await this.db.prepare(createUsersTable).run()
    await this.db.prepare(createUsersIndex).run()
    
    // Insert test user
    await this.insertTestUser()
  }

  /**
   * Clean up test database
   */
  async cleanup(): Promise<void> {
    // Drop all tables to ensure clean state
    await this.db.prepare('DROP TABLE IF EXISTS users').run()
  }

  /**
   * Reset database to clean state
   */
  async reset(): Promise<void> {
    await this.cleanup()
    await this.setup()
  }

  /**
   * Insert test user with proper password hash
   */
  async insertTestUser(username: string = 'testuser', _password: string = 'testpassword'): Promise<void> {
    // Use a pre-hashed password for testing (hash of 'testpassword')
    // This avoids importing bcryptjs in test environment
    const passwordHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8xWkBkwtl6'
    
    await this.db.prepare('INSERT OR REPLACE INTO users (username, password_hash) VALUES (?, ?)')
      .bind(username, passwordHash)
      .run()
  }

  /**
   * Get user by username
   */
  async getUser(username: string): Promise<unknown> {
    return await this.db.prepare('SELECT * FROM users WHERE username = ?')
      .bind(username)
      .first()
  }

  /**
   * Count users in database
   */
  async getUserCount(): Promise<number> {
    const result = await this.db.prepare('SELECT COUNT(*) as count FROM users').first() as { count: number } | null
    return result?.count || 0
  }
}

/**
 * Create a test database instance
 */
export function createTestDatabase(db: D1Database): TestDatabase {
  return new TestDatabase(db)
}