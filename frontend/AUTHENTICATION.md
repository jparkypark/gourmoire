# Gourmoire Frontend Authentication System

React frontend application for the Gourmoire recipe management system with comprehensive authentication features.

## Features

### Authentication System
- **Login Form**: Username/password authentication with validation
- **Authentication Context**: Global auth state management with React Context
- **Token Management**: Secure localStorage token storage with automatic refresh
- **Protected Routes**: Route guards that redirect unauthenticated users
- **Remember Me**: Persistent login sessions
- **Mobile Responsive**: Optimized for all device sizes

### Technology Stack
- **React 19** with TypeScript
- **Mantine UI** for component library
- **React Hook Form** with Zod validation
- **React Router** for client-side routing
- **Vite** for development and building

## Project Structure

```
src/
├── components/
│   ├── LoginForm.tsx        # Authentication form component
│   ├── ProtectedRoute.tsx   # Route guard component
│   └── index.ts            # Component exports
├── contexts/
│   └── AuthContext.tsx     # Authentication context & provider
├── pages/
│   ├── LoginPage.tsx       # Login page with routing
│   ├── DashboardPage.tsx   # Protected dashboard
│   └── index.ts           # Page exports
├── App.tsx                # Main app with routing setup
└── main.tsx              # Application entry point
```

## Authentication Flow

1. **Session Restoration**: On app load, checks localStorage for existing tokens
2. **Token Validation**: Verifies token expiration using JWT payload
3. **Automatic Refresh**: Refreshes tokens before expiration (5-minute intervals)
4. **Login Process**: Validates credentials and stores tokens
5. **Route Protection**: Redirects to login if unauthenticated
6. **Logout**: Clears tokens and redirects to login

## Security Features

- **Token Expiration**: JWT tokens with automatic expiration checking
- **Refresh Tokens**: Separate refresh tokens for extended sessions
- **Secure Storage**: localStorage with "remember me" functionality
- **Form Validation**: Client-side validation with Zod schemas
- **Error Handling**: Comprehensive error states and user feedback

## API Integration

The authentication system expects the following API endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh

Expected API response format:
```typescript
interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  message?: string;
  error?: string;
}
```

## Usage

### Using the Authentication Context

```tsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { state, login, logout } = useAuth();
  
  // Access user data
  console.log(state.user);
  
  // Check authentication status
  if (state.isAuthenticated) {
    // User is logged in
  }
}
```

### Creating Protected Routes

```tsx
import { ProtectedRoute } from './components/ProtectedRoute';

<Route 
  path="/protected" 
  element={
    <ProtectedRoute>
      <MyProtectedComponent />
    </ProtectedRoute>
  } 
/>
```

## Security Considerations

1. **Token Storage**: Uses localStorage for persistence but respects "remember me" preference
2. **XSS Protection**: Tokens are stored in localStorage (not sessionStorage) only when explicitly requested
3. **Token Refresh**: Automatic token refresh prevents unnecessary re-authentication
4. **Route Guards**: All protected routes require authentication
5. **Error Handling**: Graceful handling of network errors and authentication failures