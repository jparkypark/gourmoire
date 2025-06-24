import { Context } from 'hono';
import { JWTUtil } from '../utils/jwt';
import { RefreshTokenRequest, RefreshTokenResponse, AuthError, JWTPayload, Env } from '../types';

/**
 * POST /api/auth/refresh
 * Validates refresh token and returns new access token
 */
export const refreshHandler = async (c: Context<{ Bindings: Env; Variables: { refreshPayload: JWTPayload } }>): Promise<Response> => {
  try {
    const body: RefreshTokenRequest = await c.req.json().catch(() => ({}));
    
    if (!body.refreshToken) {
      return c.json({
        success: false,
        message: 'Refresh token is required',
        code: 'TOKEN_INVALID'
      } as AuthError, 400);
    }

    // Get the validated refresh token payload (set by refreshTokenMiddleware)
    const refreshPayload = c.get('refreshPayload');
    
    if (!refreshPayload) {
      return c.json({
        success: false,
        message: 'Invalid refresh token',
        code: 'TOKEN_INVALID'
      } as AuthError, 403);
    }

    // Check if refresh token is blacklisted
    const refreshBlacklistKey = `blacklist:${body.refreshToken}`;
    const isBlacklisted = await c.env.AUTH_KV.get(refreshBlacklistKey);
    
    if (isBlacklisted) {
      return c.json({
        success: false,
        message: 'Refresh token has been revoked',
        code: 'TOKEN_INVALID'
      } as AuthError, 403);
    }

    // Check if user has been logged out globally
    const userLogoutKey = `user_logout:${refreshPayload.userId}`;
    const userLogoutTimestamp = await c.env.AUTH_KV.get(userLogoutKey);
    
    if (userLogoutTimestamp) {
      const logoutTime = parseInt(userLogoutTimestamp);
      const tokenIssuedTime = refreshPayload.iat * 1000; // Convert to milliseconds
      
      if (tokenIssuedTime < logoutTime) {
        return c.json({
          success: false,
          message: 'Token has been invalidated',
          code: 'TOKEN_INVALID'
        } as AuthError, 403);
      }
    }

    // Verify user still exists in D1 database
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(refreshPayload.userId)
      .first();
    
    if (!user) {
      return c.json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      } as AuthError, 404);
    }

    // Generate new access token
    const jwtUtil = new JWTUtil(c.env);
    
    // Determine if this was a "remember me" token based on expiration
    const tokenLifetime = refreshPayload.exp - refreshPayload.iat;
    const isRememberMe = tokenLifetime > (7 * 24 * 60 * 60); // More than 7 days
    
    const tokenPayload = {
      userId: user.id as string,
      username: user.username as string,
      email: user.email as string || ''
    };

    const newAccessToken = await jwtUtil.generateAccessToken(tokenPayload, isRememberMe);
    
    // Optionally, generate a new refresh token for token rotation
    const newRefreshToken = await jwtUtil.generateRefreshToken(tokenPayload, isRememberMe);
    
    // Blacklist the old refresh token
    const oldRefreshBlacklistKey = `blacklist:${body.refreshToken}`;
    await c.env.AUTH_KV.put(oldRefreshBlacklistKey, 'true', {
      expirationTtl: 90 * 24 * 60 * 60 // 90 days
    });

    // Store the new refresh token
    const refreshTokenKey = `refresh_token:${user.id}:${Date.now()}`;
    const refreshTokenExpiry = isRememberMe ? 90 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
    
    await c.env.AUTH_KV.put(refreshTokenKey, newRefreshToken, {
      expirationTtl: refreshTokenExpiry
    });

    const response: RefreshTokenResponse = {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: jwtUtil.getTokenExpirationTime(isRememberMe)
    };

    return c.json(response, 200);

  } catch (error) {
    console.error('Refresh token error:', error);
    
    return c.json({
      success: false,
      message: 'Internal server error during token refresh',
      code: 'TOKEN_INVALID'
    } as AuthError, 500);
  }
};