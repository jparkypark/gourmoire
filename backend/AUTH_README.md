# Gourmoire API Authentication System

## Overview

This document describes the JWT-based authentication system implemented for the Gourmoire API. The system provides secure user authentication with access and refresh tokens, blacklisting capabilities, and "remember me" functionality.

## Architecture

### Technologies Used
- **Cloudflare Workers**: Runtime environment
- **D1 Database**: User data storage
- **KV Storage**: Token blacklisting and session management
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing
- **Hono**: Web framework

### Token Strategy
- **Access Tokens**: Short-lived (24 hours, 30 days for "remember me")
- **Refresh Tokens**: Longer-lived (7 days, 90 days for "remember me") 
- **Token Rotation**: New refresh token issued on each refresh

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login
Authenticates a user and returns JWT tokens.

**Request:**
```json
{
  "username": "string",
  "password": "string",
  "rememberMe": "boolean (optional)"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  },
  "accessToken": "string",
  "refreshToken": "string",
  "expiresIn": 86400,
  "message": "Login successful"
}
```

#### POST /api/auth/refresh
Refreshes an access token using a valid refresh token.

**Request:**
```json
{
  "refreshToken": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "accessToken": "string",
  "refreshToken": "string",
  "expiresIn": 86400
}
```

#### POST /api/auth/logout (Protected)
Invalidates tokens and logs out the user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request (Optional):**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### Protected Endpoints

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <access_token>
```

#### User Endpoints
- `GET /api/user/profile` - Get current user profile
- `GET /api/user/:username` - Get specific user (self only)

#### Recipe Endpoints (Placeholders)
- `GET /api/recipes` - List user's recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/:id` - Get specific recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

## Security Features

### Token Security
- **JWT Signing**: Separate secrets for access and refresh tokens
- **Token Validation**: Issuer and audience claims verification
- **Token Blacklisting**: Immediate revocation via KV storage
- **Global Logout**: User-wide token invalidation

### Password Security
- **bcrypt Hashing**: 12 salt rounds
- **Password Validation**: Strength requirements (8+ chars, mixed case, digits, special chars)

### Session Management
- **Refresh Token Storage**: KV-based with automatic expiration
- **Remember Me**: Extended token lifetimes
- **Token Rotation**: New refresh token on each use

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Error Codes
- `INVALID_CREDENTIALS`: Wrong username/password
- `TOKEN_EXPIRED`: Token has expired
- `TOKEN_INVALID`: Token is malformed or revoked
- `USER_NOT_FOUND`: User doesn't exist
- `UNAUTHORIZED`: Authentication required

## Middleware

### authMiddleware
- Validates access tokens
- Checks blacklist status
- Adds user context to request
- Required for all protected routes

### refreshTokenMiddleware
- Validates refresh tokens
- Used specifically for refresh endpoint
- Prepares payload for refresh handler

### optionalAuthMiddleware
- Provides optional authentication
- Doesn't fail on missing/invalid tokens
- Useful for public endpoints with user-specific features

## Environment Variables

Required secrets (set via `wrangler secret`):
- `JWT_SECRET`: Access token signing key
- `JWT_REFRESH_SECRET`: Refresh token signing key

## KV Namespaces

### AUTH_KV
- Token blacklisting: `blacklist:<token>`
- User logout timestamps: `user_logout:<user_id>`
- Refresh token storage: `refresh_token:<user_id>:<timestamp>`

### USERS_KV
- User data caching (if needed)

### RECIPES_KV
- Recipe data storage (future use)

## Database Schema

The system integrates with existing D1 database:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set JWT Secrets:**
   ```bash
   wrangler secret put JWT_SECRET
   wrangler secret put JWT_REFRESH_SECRET
   ```

3. **Configure KV Namespaces:**
   Update `wrangler.toml` with actual KV namespace IDs

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Testing

### Login Flow
1. POST to `/api/auth/login` with credentials
2. Store returned tokens
3. Use access token in Authorization header for protected requests
4. Use refresh token to get new access token when expired

### Example with curl
```bash
# Login
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Access protected endpoint
curl -X GET http://localhost:8787/api/user/profile \
  -H "Authorization: Bearer <access_token>"

# Refresh token
curl -X POST http://localhost:8787/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'

# Logout
curl -X POST http://localhost:8787/api/auth/logout \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'
```

## Implementation Notes

### Token Expiration Times
- **Standard Access Token**: 24 hours
- **Remember Me Access Token**: 30 days
- **Standard Refresh Token**: 7 days
- **Remember Me Refresh Token**: 90 days

### Security Considerations
- Tokens are stateless JWT but can be revoked via blacklist
- Refresh token rotation prevents replay attacks
- Global logout invalidates all user sessions
- Password requirements enforce strong authentication

### Performance
- KV operations are optimized for token validation
- D1 queries are minimal (user lookup only)
- JWT verification is fast and stateless