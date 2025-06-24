-- Migration: Create users table for authentication
-- Date: 2024-06-23
-- Description: Single user authentication table with secure password hashing

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create index on username for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert the single hardcoded user (password will be hashed in code)
-- Note: The actual password hash will be inserted via the seeding script