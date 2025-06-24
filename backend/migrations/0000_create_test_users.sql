-- Test Migration: Create users table for testing
-- Date: 2024-06-24
-- Description: Test database users table for isolated testing

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create index on username for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert test user for testing
-- Password: 'testpassword' (will be hashed properly in test setup)
INSERT OR IGNORE INTO users (username, password_hash) VALUES (
    'testuser',
    '$argon2id$v=19$m=65536,t=2,p=1$random_salt_for_testing$hash_placeholder'
);