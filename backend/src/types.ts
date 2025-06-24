export interface Env {
  DB: D1Database;
  USERS_KV: KVNamespace;
  RECIPES_KV: KVNamespace;
  AUTH_KV: KVNamespace;
  ENVIRONMENT: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface DatabaseUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    email?: string;
  };
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  message?: string;
}

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}

export interface AuthContext {
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
}

export interface AuthError {
  success: false;
  message: string;
  code: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'USER_NOT_FOUND' | 'UNAUTHORIZED';
}