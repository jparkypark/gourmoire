import { Context } from 'hono';
import { AuthContext, Env } from '../types';

/**
 * POST /api/auth/logout
 * Invalidates the user's refresh tokens and logs them out
 */
export const logoutHandler = async (c: Context<{ Bindings: Env; Variables: { auth: AuthContext } }>): Promise<Response> => {
  try {
    const auth = c.get('auth');
    
    if (!auth) {
      return c.json({
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, 401);
    }

    // Get refresh token from request body (optional)
    const body = await c.req.json().catch(() => ({}));
    const refreshToken = body.refreshToken;

    // Add the current access token to blacklist
    const tokenBlacklistKey = `blacklist:${auth.token}`;
    await c.env.AUTH_KV.put(tokenBlacklistKey, 'true', {
      expirationTtl: 24 * 60 * 60 // 24 hours (max access token lifetime)
    });

    // If refresh token is provided, blacklist it too
    if (refreshToken) {
      const refreshBlacklistKey = `blacklist:${refreshToken}`;
      await c.env.AUTH_KV.put(refreshBlacklistKey, 'true', {
        expirationTtl: 90 * 24 * 60 * 60 // 90 days (max refresh token lifetime)
      });
    }

    // Store user logout timestamp to invalidate all existing tokens
    const logoutTimestamp = Date.now();
    const userLogoutKey = `user_logout:${auth.user.id}`;
    await c.env.AUTH_KV.put(userLogoutKey, logoutTimestamp.toString(), {
      expirationTtl: 90 * 24 * 60 * 60 // Keep for 90 days
    });

    return c.json({
      success: true,
      message: 'Successfully logged out'
    }, 200);

  } catch (error) {
    console.error('Logout error:', error);
    
    return c.json({
      success: false,
      message: 'Internal server error during logout',
      code: 'UNAUTHORIZED'
    }, 500);
  }
};