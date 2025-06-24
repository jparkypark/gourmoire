import { JWTPayload, AuthError, Env } from '../types';

// Web Crypto API-based JWT implementation for Cloudflare Workers

// Base64 URL encoding/decoding
function base64UrlEncode(data: string): string {
  return btoa(data)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(data: string): string {
  // Add padding if necessary
  const padded = data + '='.repeat((4 - (data.length % 4)) % 4);
  return atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
}

// Generate HMAC-SHA256 signature using Web Crypto API
async function generateSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

// Verify HMAC-SHA256 signature
async function verifySignature(data: string, signature: string, secret: string): Promise<boolean> {
  const expectedSignature = await generateSignature(data, secret);
  return expectedSignature === signature;
}

export class JWTUtil {
  private jwtSecret: string;
  private refreshSecret: string;

  constructor(env: Env) {
    this.jwtSecret = env.JWT_SECRET || 'your-secret-access-key';
    this.refreshSecret = env.JWT_REFRESH_SECRET || 'your-secret-refresh-key';
  }

  /**
   * Generate access token (24 hours by default, 30 days for remember me)
   */
  async generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'type'>, rememberMe = false): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const expirationTime = rememberMe ? now + (30 * 24 * 60 * 60) : now + (24 * 60 * 60);
    
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const tokenPayload: JWTPayload = {
      ...payload,
      type: 'access',
      iat: now,
      exp: expirationTime
    };

    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(tokenPayload));
    const data = `${headerEncoded}.${payloadEncoded}`;
    const signature = await generateSignature(data, this.jwtSecret);

    return `${data}.${signature}`;
  }

  /**
   * Generate refresh token (7 days by default, 90 days for remember me)
   */
  async generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'type'>, rememberMe = false): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const expirationTime = rememberMe ? now + (90 * 24 * 60 * 60) : now + (7 * 24 * 60 * 60);
    
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const tokenPayload: JWTPayload = {
      ...payload,
      type: 'refresh',
      iat: now,
      exp: expirationTime
    };

    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(tokenPayload));
    const data = `${headerEncoded}.${payloadEncoded}`;
    const signature = await generateSignature(data, this.refreshSecret);

    return `${data}.${signature}`;
  }

  /**
   * Verify access token
   */
  async verifyAccessToken(token: string): Promise<JWTPayload | AuthError> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {
          success: false,
          message: 'Invalid access token format',
          code: 'TOKEN_INVALID'
        };
      }

      const [headerEncoded, payloadEncoded, signature] = parts;
      const data = `${headerEncoded}.${payloadEncoded}`;
      
      // Verify signature
      const isValid = await verifySignature(data, signature, this.jwtSecret);
      if (!isValid) {
        return {
          success: false,
          message: 'Invalid access token signature',
          code: 'TOKEN_INVALID'
        };
      }

      // Decode and validate payload
      const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as JWTPayload;
      
      // Check token type
      if (payload.type !== 'access') {
        return {
          success: false,
          message: 'Invalid token type',
          code: 'TOKEN_INVALID'
        };
      }

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        return {
          success: false,
          message: 'Access token has expired',
          code: 'TOKEN_EXPIRED'
        };
      }

      return payload;
    } catch {
      return {
        success: false,
        message: 'Invalid access token',
        code: 'TOKEN_INVALID'
      };
    }
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(token: string): Promise<JWTPayload | AuthError> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {
          success: false,
          message: 'Invalid refresh token format',
          code: 'TOKEN_INVALID'
        };
      }

      const [headerEncoded, payloadEncoded, signature] = parts;
      const data = `${headerEncoded}.${payloadEncoded}`;
      
      // Verify signature
      const isValid = await verifySignature(data, signature, this.refreshSecret);
      if (!isValid) {
        return {
          success: false,
          message: 'Invalid refresh token signature',
          code: 'TOKEN_INVALID'
        };
      }

      // Decode and validate payload
      const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as JWTPayload;
      
      // Check token type
      if (payload.type !== 'refresh') {
        return {
          success: false,
          message: 'Invalid token type',
          code: 'TOKEN_INVALID'
        };
      }

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        return {
          success: false,
          message: 'Refresh token has expired',
          code: 'TOKEN_EXPIRED'
        };
      }

      return payload;
    } catch {
      return {
        success: false,
        message: 'Invalid refresh token',
        code: 'TOKEN_INVALID'
      };
    }
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    
    return parts[1];
  }

  /**
   * Get token expiration time in seconds
   */
  getTokenExpirationTime(rememberMe = false): number {
    return rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 24 hours in seconds
  }
}