import { describe, it, expect } from 'vitest'
import { createMockEnv } from '../helpers/mock-env'

describe('Database Operations Tests', () => {
  describe('Mock Environment', () => {
    it('should create mock environment correctly', () => {
      const mockEnv = createMockEnv()
      
      expect(mockEnv.DB).toBeDefined()
      expect(mockEnv.AUTH_KV).toBeDefined()
      expect(mockEnv.USERS_KV).toBeDefined()
      expect(mockEnv.RECIPES_KV).toBeDefined()
      expect(mockEnv.JWT_SECRET).toBe('test-jwt-secret-key-for-testing')
      expect(mockEnv.JWT_REFRESH_SECRET).toBe('test-refresh-secret-key-for-testing')
    })

    it('should have functional mock database', async () => {
      const mockEnv = createMockEnv()
      
      // Test basic DB operations
      const result = await mockEnv.DB.prepare('SELECT 1').first()
      expect(result).toBeNull() // Mock returns null by default
      
      const runResult = await mockEnv.DB.prepare('INSERT INTO test VALUES (?)').bind('test').run()
      expect(runResult).toBeDefined()
    })

    it('should have functional mock KV', async () => {
      const mockEnv = createMockEnv()
      
      // Test KV operations
      await mockEnv.AUTH_KV.put('test-key', 'test-value')
      const value = await mockEnv.AUTH_KV.get('test-key')
      expect(value).toBe('test-value')
      
      await mockEnv.AUTH_KV.delete('test-key')
      const deletedValue = await mockEnv.AUTH_KV.get('test-key')
      expect(deletedValue).toBeNull()
    })
  })
})