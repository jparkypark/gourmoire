import { Context, Next } from 'hono';
import { JWTUtil } from '../utils/jwt';
import { AuthContext, AuthError, JWTPayload, Env } from '../types';

/**
 * JWT Authentication Middleware
 * Validates access tokens and adds user context to the request
 */
export const authMiddleware = async (c: Context<{ Bindings: Env; Variables: { auth: AuthContext } }>, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader) {
    return c.json({
      success: false,
      message: 'Authorization header is required',
      code: 'UNAUTHORIZED'
    }, 401);
  }

  const jwtUtil = new JWTUtil(c.env);
  const token = jwtUtil.extractTokenFromHeader(authHeader);
  
  if (!token) {
    return c.json({
      success: false,
      message: 'Invalid authorization header format. Use: Bearer <token>',
      code: 'UNAUTHORIZED'
    }, 401);
  }

  const payload = await jwtUtil.verifyAccessToken(token);
  
  if ('success' in payload && !payload.success) {
    const authError = payload as AuthError;
    const statusCode = authError.code === 'TOKEN_EXPIRED' ? 401 : 403;
    
    return c.json({
      success: false,
      message: authError.message,
      code: authError.code
    }, statusCode);
  }

  const validPayload = payload as JWTPayload;

  // Check if token is blacklisted
  const tokenBlacklistKey = `blacklist:${token}`;
  const isBlacklisted = await c.env.AUTH_KV.get(tokenBlacklistKey);
  
  if (isBlacklisted) {
    return c.json({
      success: false,
      message: 'Token has been revoked',
      code: 'TOKEN_INVALID'
    }, 403);
  }

  // Check if user has been logged out globally
  const userLogoutKey = `user_logout:${validPayload.userId}`;
  const userLogoutTimestamp = await c.env.AUTH_KV.get(userLogoutKey);
  
  if (userLogoutTimestamp) {
    const logoutTime = parseInt(userLogoutTimestamp);
    const tokenIssuedTime = validPayload.iat * 1000; // Convert to milliseconds
    
    if (tokenIssuedTime < logoutTime) {
      return c.json({
        success: false,
        message: 'Token has been invalidated',
        code: 'TOKEN_INVALID'
      }, 403);
    }
  }

  // Token is valid, add auth context to request
  c.set('auth', {
    user: {
      id: validPayload.userId,
      username: validPayload.username,
      email: validPayload.email
    },
    token
  });

  await next();
};

/**
 * Optional auth middleware - doesn't fail if token is missing/invalid
 * but adds auth context if valid token is provided
 */
export const optionalAuthMiddleware = async (c: Context<{ Bindings: Env; Variables: { auth?: AuthContext } }>, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (authHeader) {
    const jwtUtil = new JWTUtil(c.env);
    const token = jwtUtil.extractTokenFromHeader(authHeader);
    
    if (token) {
      const payload = await jwtUtil.verifyAccessToken(token);
      
      if (!('success' in payload)) {
        // Valid token, add auth context
        c.set('auth', {
          user: {
            id: payload.userId,
            username: payload.username,
            email: payload.email
          },
          token
        });
      }
    }
  }

  await next();
};

/**
 * Middleware to check if user is authenticated (used after authMiddleware)
 */
export const requireAuth = async (c: Context<{ Variables: { auth: AuthContext } }>, next: Next) => {
  const auth = c.get('auth');
  
  if (!auth) {
    return c.json({
      success: false,
      message: 'Authentication required',
      code: 'UNAUTHORIZED'
    }, 401);
  }

  await next();
};

/**
 * Middleware to validate refresh token for refresh endpoint
 */
export const refreshTokenMiddleware = async (c: Context<{ Bindings: Env; Variables: { refreshPayload: JWTPayload } }>, next: Next) => {
  const body = await c.req.json().catch(() => null);
  
  if (!body || !body.refreshToken) {
    return c.json({
      success: false,
      message: 'Refresh token is required',
      code: 'TOKEN_INVALID'
    }, 400);
  }

  const jwtUtil = new JWTUtil(c.env);
  const payload = await jwtUtil.verifyRefreshToken(body.refreshToken);
  
  if ('success' in payload && !payload.success) {
    const authError = payload as AuthError;
    const statusCode = authError.code === 'TOKEN_EXPIRED' ? 401 : 403;
    
    return c.json({
      success: false,
      message: authError.message,
      code: authError.code
    }, statusCode);
  }

  // Store the validated payload for use in the route handler
  c.set('refreshPayload', payload as JWTPayload);
  await next();
};