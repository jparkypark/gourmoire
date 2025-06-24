import { describe, it, expect, beforeEach } from 'vitest'
import { JWTUtil } from '../jwt'
import { createMockEnv } from '../../test/helpers/mock-env'

describe('JWTUtil', () => {
  let jwtUtil: JWTUtil
  let mockEnv: ReturnType<typeof createMockEnv>

  beforeEach(() => {
    mockEnv = createMockEnv()
    // Cast to Env since we're testing the JWT utility specifically
    jwtUtil = new JWTUtil(mockEnv as any)
  })

  describe('generateAccessToken', () => {
    it('generates valid access token', async () => {
      const payload = { 
        userId: '123', 
        username: 'testuser', 
        email: 'test@example.com' 
      }
      
      const token = await jwtUtil.generateAccessToken(payload)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('generates token with remember me expiration', async () => {
      const payload = { 
        userId: '123', 
        username: 'testuser', 
        email: 'test@example.com' 
      }
      
      const token = await jwtUtil.generateAccessToken(payload, true)
      const verifiedPayload = await jwtUtil.verifyAccessToken(token)
      
      expect(verifiedPayload).not.toHaveProperty('success')
      if ('exp' in verifiedPayload) {
        const now = Math.floor(Date.now() / 1000)
        const expectedExp = now + (30 * 24 * 60 * 60) // 30 days
        expect(verifiedPayload.exp).toBeCloseTo(expectedExp, -2) // Within 100 seconds
      }
    })
  })

  describe('generateRefreshToken', () => {
    it('generates valid refresh token', async () => {
      const payload = { 
        userId: '123', 
        username: 'testuser', 
        email: 'test@example.com' 
      }
      
      const token = await jwtUtil.generateRefreshToken(payload)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('generates token with remember me expiration', async () => {
      const payload = { 
        userId: '123', 
        username: 'testuser', 
        email: 'test@example.com' 
      }
      
      const token = await jwtUtil.generateRefreshToken(payload, true)
      const verifiedPayload = await jwtUtil.verifyRefreshToken(token)
      
      expect(verifiedPayload).not.toHaveProperty('success')
      if ('exp' in verifiedPayload) {
        const now = Math.floor(Date.now() / 1000)
        const expectedExp = now + (90 * 24 * 60 * 60) // 90 days
        expect(verifiedPayload.exp).toBeCloseTo(expectedExp, -2) // Within 100 seconds
      }
    })
  })

  describe('verifyAccessToken', () => {
    it('verifies valid access token', async () => {
      const payload = { 
        userId: '123', 
        username: 'testuser', 
        email: 'test@example.com' 
      }
      
      const token = await jwtUtil.generateAccessToken(payload)
      const result = await jwtUtil.verifyAccessToken(token)
      
      expect(result).not.toHaveProperty('success')
      if ('userId' in result) {
        expect(result.userId).toBe(payload.userId)
        expect(result.username).toBe(payload.username)
        expect(result.email).toBe(payload.email)
        expect(result.type).toBe('access')
      }
    })

    it('rejects token with invalid format', async () => {
      const result = await jwtUtil.verifyAccessToken('invalid.token')
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('code', 'TOKEN_INVALID')
      expect(result).toHaveProperty('message', 'Invalid access token format')
    })

    it('rejects token with invalid signature', async () => {
      const payload = { 
        userId: '123', 
        username: 'testuser', 
        email: 'test@example.com' 
      }
      
      const token = await jwtUtil.generateAccessToken(payload)
      const tampered = token.slice(0, -5) + 'XXXXX'
      const result = await jwtUtil.verifyAccessToken(tampered)
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('code', 'TOKEN_INVALID')
    })

    it('rejects refresh token used as access token', async () => {
      const payload = { 
        userId: '123', 
        username: 'testuser', 
        email: 'test@example.com' 
      }
      
      const refreshToken = await jwtUtil.generateRefreshToken(payload)
      const result = await jwtUtil.verifyAccessToken(refreshToken)
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('code', 'TOKEN_INVALID')
      // Since refresh tokens are signed with different secret, it will fail signature verification first
      expect(result).toHaveProperty('message', 'Invalid access token signature')
    })
  })

  describe('verifyRefreshToken', () => {
    it('verifies valid refresh token', async () => {
      const payload = { 
        userId: '123', 
        username: 'testuser', 
        email: 'test@example.com' 
      }
      
      const token = await jwtUtil.generateRefreshToken(payload)
      const result = await jwtUtil.verifyRefreshToken(token)
      
      expect(result).not.toHaveProperty('success')
      if ('userId' in result) {
        expect(result.userId).toBe(payload.userId)
        expect(result.username).toBe(payload.username)
        expect(result.email).toBe(payload.email)
        expect(result.type).toBe('refresh')
      }
    })

    it('rejects access token used as refresh token', async () => {
      const payload = { 
        userId: '123', 
        username: 'testuser', 
        email: 'test@example.com' 
      }
      
      const accessToken = await jwtUtil.generateAccessToken(payload)
      const result = await jwtUtil.verifyRefreshToken(accessToken)
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('code', 'TOKEN_INVALID')
      // Since access tokens are signed with different secret, it will fail signature verification first
      expect(result).toHaveProperty('message', 'Invalid refresh token signature')
    })
  })

  describe('extractTokenFromHeader', () => {
    it('extracts token from valid Authorization header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature'
      const header = `Bearer ${token}`
      
      const result = jwtUtil.extractTokenFromHeader(header)
      
      expect(result).toBe(token)
    })

    it('returns null for invalid header format', () => {
      expect(jwtUtil.extractTokenFromHeader('Invalid header')).toBeNull()
      expect(jwtUtil.extractTokenFromHeader('Bearer')).toBeNull()
      expect(jwtUtil.extractTokenFromHeader('Bearer token extra')).toBeNull()
      expect(jwtUtil.extractTokenFromHeader('')).toBeNull()
      expect(jwtUtil.extractTokenFromHeader(null)).toBeNull()
    })

    it('returns null for non-Bearer token', () => {
      const result = jwtUtil.extractTokenFromHeader('Basic dGVzdDp0ZXN0')
      expect(result).toBeNull()
    })
  })

  describe('getTokenExpirationTime', () => {
    it('returns correct expiration time for normal token', () => {
      const result = jwtUtil.getTokenExpirationTime(false)
      expect(result).toBe(24 * 60 * 60) // 24 hours in seconds
    })

    it('returns correct expiration time for remember me token', () => {
      const result = jwtUtil.getTokenExpirationTime(true)
      expect(result).toBe(30 * 24 * 60 * 60) // 30 days in seconds
    })
  })
})