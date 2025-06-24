# Gourmoire Backend

Cloudflare Workers backend for the Gourmoire recipe management application.

## Features

- Single-user authentication with bcrypt password hashing
- SQLite database via Cloudflare D1
- RESTful API built with Hono framework
- TypeScript support with proper type definitions

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Authentication

The system uses a single hardcoded user account:
- **Username**: `user`
- **Password**: `password123`

The password is securely hashed using bcrypt with 12 salt rounds before storage.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate user
  - Body: `{ "username": "user", "password": "password123" }`
  - Returns user info on success

### Utility
- `GET /api/health` - Health check and database status
- `GET /api/user/:username` - Get user info (for testing)

## Development

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Database Setup
The database is automatically initialized on first request with:
1. User table creation (via migrations)
2. Initial user seeding with hashed password

### Migration Files
- `migrations/0001_create_users.sql` - Creates users table with constraints
- `migrations/0002_seed_initial_user.sql` - Documentation for user seeding

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- Input validation on all endpoints
- CORS configuration for frontend integration
- No password hashes exposed in API responses

## Configuration

### wrangler.toml
- Configures D1 database binding
- Sets environment variables
- Defines migrations directory

### Environment
- `ENVIRONMENT`: Set to "development" for dev mode
- Database binding: `DB` (D1Database)