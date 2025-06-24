# Database Schema Documentation

## Overview
Gourmoire uses SQLite (via Cloudflare D1) for data storage. The database is designed for single-user authentication with secure password storage.

## Tables

### users
Single-user authentication table.

| Column        | Type    | Constraints                    | Description                     |
|---------------|---------|--------------------------------|---------------------------------|
| id            | INTEGER | PRIMARY KEY AUTOINCREMENT      | Unique user identifier          |
| username      | TEXT    | NOT NULL UNIQUE                | Username for login              |
| password_hash | TEXT    | NOT NULL                       | bcrypt hashed password          |
| created_at    | TEXT    | NOT NULL DEFAULT (datetime('now')) | Account creation timestamp  |

#### Indexes
- `idx_users_username` on `username` - Fast username lookups for authentication

#### Initial Data
- Single user account with username: `user` and password: `password123`
- Password is hashed using bcrypt with 12 salt rounds

## Security Considerations

1. **Password Hashing**: Uses bcrypt with 12 salt rounds for secure password storage
2. **No Plain Text**: Passwords are never stored in plain text
3. **Unique Constraints**: Username must be unique to prevent duplicates
4. **Timestamps**: All records include creation timestamps for audit trails

## Migration Strategy

1. **0001_create_users.sql**: Creates the users table with proper constraints
2. **0002_seed_initial_user.sql**: Documents the seeding process (actual seeding done programmatically)

## API Data Flow

1. User submits login credentials
2. System looks up user by username
3. Password verified against stored bcrypt hash
4. User info returned (without password hash) on successful authentication