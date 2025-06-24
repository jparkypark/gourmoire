/**
 * Example: Backend Unit Testing Patterns
 * 
 * This file demonstrates comprehensive unit testing patterns for backend utilities,
 * including pure functions, class methods, error handling, and edge cases.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockEnv } from '../../backend/src/test/helpers/mock-env'

// Example utility class for demonstration
class DataProcessor {
  private env: any

  constructor(env: any) {
    this.env = env
  }

  // Pure function example
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Async method with external dependencies
  async processUserData(userData: { email: string; name: string }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Validate input
      if (!DataProcessor.validateEmail(userData.email)) {
        return { success: false, error: 'Invalid email format' }
      }

      if (!userData.name || userData.name.trim().length === 0) {
        return { success: false, error: 'Name is required' }
      }

      // Simulate database operation
      const processedData = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email.toLowerCase().trim(),
        name: userData.name.trim(),
        createdAt: new Date().toISOString()
      }

      return { success: true, data: processedData }
    } catch (error) {
      return { success: false, error: 'Processing failed' }
    }
  }

  // Method with KV store interaction
  async cacheData(key: string, data: any, ttl: number = 3600): Promise<boolean> {
    try {
      await this.env.CACHE_KV.put(key, JSON.stringify(data), { expirationTtl: ttl })
      return true
    } catch (error) {
      return false
    }
  }

  // Method with database interaction
  async getUserById(id: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const result = await this.env.DB.prepare(
        'SELECT * FROM users WHERE id = ?'
      ).bind(id).first()

      if (!result) {
        return { success: false, error: 'User not found' }
      }

      return { success: true, user: result }
    } catch (error) {
      return { success: false, error: 'Database error' }
    }
  }
}

// Example utility functions for testing patterns
const StringUtils = {
  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  },

  generateRandomString: (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

describe('Backend Unit Testing Patterns', () => {

  describe('Pure Function Testing', () => {
    describe('StringUtils.slugify', () => {
      it('converts text to lowercase slug', () => {
        expect(StringUtils.slugify('Hello World')).toBe('hello-world')
      })

      it('removes special characters', () => {
        expect(StringUtils.slugify('Hello, World!')).toBe('hello-world')
      })

      it('handles multiple spaces and hyphens', () => {
        expect(StringUtils.slugify('Hello   ---   World')).toBe('hello-world')
      })

      it('trims leading and trailing hyphens', () => {
        expect(StringUtils.slugify('  -Hello World-  ')).toBe('hello-world')
      })

      it('handles empty string', () => {
        expect(StringUtils.slugify('')).toBe('')
      })

      it('handles string with only special characters', () => {
        expect(StringUtils.slugify('!@#$%^&*()')).toBe('')
      })

      it('preserves numbers and underscores', () => {
        expect(StringUtils.slugify('Test_123')).toBe('test-123')
      })
    })

    describe('StringUtils.truncate', () => {
      it('returns original string when under limit', () => {
        const text = 'Short text'
        expect(StringUtils.truncate(text, 20)).toBe(text)
      })

      it('truncates long text with ellipsis', () => {
        const text = 'This is a very long text that should be truncated'
        const result = StringUtils.truncate(text, 20)
        expect(result).toBe('This is a very lo...')
        expect(result.length).toBe(20)
      })

      it('handles exact length text', () => {
        const text = 'Exactly 20 chars!!!'
        expect(StringUtils.truncate(text, 20)).toBe(text)
      })

      it('handles empty string', () => {
        expect(StringUtils.truncate('', 10)).toBe('')
      })

      it('handles very short max length', () => {
        expect(StringUtils.truncate('Hello', 3)).toBe('...')
      })
    })

    describe('DataProcessor.validateEmail', () => {
      it('validates correct email formats', () => {
        const validEmails = [
          'test@example.com',
          'user.name@domain.co.uk',
          'user+tag@example.org',
          'user123@test-domain.com'
        ]

        validEmails.forEach(email => {
          expect(DataProcessor.validateEmail(email)).toBe(true)
        })
      })

      it('rejects invalid email formats', () => {
        const invalidEmails = [
          'not-an-email',
          '@example.com',
          'test@',
          'test.example.com',
          'test@.com',
          'test@com',
          '',
          'test space@example.com'
        ]

        invalidEmails.forEach(email => {
          expect(DataProcessor.validateEmail(email)).toBe(false)
        })
      })
    })
  })

  describe('Class Method Testing with Dependencies', () => {
    let processor: DataProcessor
    let mockEnv: ReturnType<typeof createMockEnv>

    beforeEach(() => {
      mockEnv = createMockEnv()
      processor = new DataProcessor(mockEnv)
    })

    describe('DataProcessor.processUserData', () => {
      it('processes valid user data successfully', async () => {
        const userData = {
          email: 'test@example.com',
          name: 'Test User'
        }

        const result = await processor.processUserData(userData)

        expect(result.success).toBe(true)
        expect(result.data).toMatchObject({
          id: expect.any(String),
          email: 'test@example.com',
          name: 'Test User',
          createdAt: expect.any(String)
        })
      })

      it('rejects invalid email', async () => {
        const userData = {
          email: 'invalid-email',
          name: 'Test User'
        }

        const result = await processor.processUserData(userData)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Invalid email format')
        expect(result.data).toBeUndefined()
      })

      it('rejects empty name', async () => {
        const userData = {
          email: 'test@example.com',
          name: ''
        }

        const result = await processor.processUserData(userData)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Name is required')
      })

      it('trims whitespace from inputs', async () => {
        const userData = {
          email: '  TEST@EXAMPLE.COM  ',
          name: '  Test User  '
        }

        const result = await processor.processUserData(userData)

        expect(result.success).toBe(true)
        expect(result.data?.email).toBe('test@example.com')
        expect(result.data?.name).toBe('Test User')
      })

      it('handles processing errors gracefully', async () => {
        const userData = {
          email: 'test@example.com',
          name: 'Test User'
        }

        // Mock an error during processing
        vi.spyOn(Math, 'random').mockImplementation(() => {
          throw new Error('Random generation failed')
        })

        const result = await processor.processUserData(userData)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Processing failed')

        // Restore the mock
        vi.restoreAllMocks()
      })
    })

    describe('DataProcessor.cacheData', () => {
      it('successfully caches data with default TTL', async () => {
        const testData = { key: 'value', number: 123 }
        
        const result = await processor.cacheData('test-key', testData)
        
        expect(result).toBe(true)
        
        // Verify data was stored
        const stored = await mockEnv.CACHE_KV.get('test-key')
        expect(JSON.parse(stored!)).toEqual(testData)
      })

      it('successfully caches data with custom TTL', async () => {
        const testData = { test: true }
        const customTtl = 7200
        
        const result = await processor.cacheData('ttl-key', testData, customTtl)
        
        expect(result).toBe(true)
      })

      it('handles cache storage errors', async () => {
        // Mock KV put to throw an error
        mockEnv.CACHE_KV.put = vi.fn().mockRejectedValue(new Error('KV error'))
        
        const result = await processor.cacheData('error-key', { test: true })
        
        expect(result).toBe(false)
      })

      it('handles complex data serialization', async () => {
        const complexData = {
          array: [1, 2, 3],
          nested: { deep: { value: 'test' } },
          date: new Date().toISOString(),
          nullValue: null
        }
        
        const result = await processor.cacheData('complex-key', complexData)
        
        expect(result).toBe(true)
        
        const stored = await mockEnv.CACHE_KV.get('complex-key')
        expect(JSON.parse(stored!)).toEqual(complexData)
      })
    })

    describe('DataProcessor.getUserById', () => {
      beforeEach(async () => {
        // Set up test data in mock database
        await mockEnv.DB.prepare(`
          INSERT INTO users (id, name, email) VALUES 
          ('user-1', 'Test User', 'test@example.com'),
          ('user-2', 'Another User', 'another@example.com')
        `).run()
      })

      it('returns user when found', async () => {
        const result = await processor.getUserById('user-1')
        
        expect(result.success).toBe(true)
        expect(result.user).toMatchObject({
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com'
        })
      })

      it('returns error when user not found', async () => {
        const result = await processor.getUserById('nonexistent')
        
        expect(result.success).toBe(false)
        expect(result.error).toBe('User not found')
        expect(result.user).toBeUndefined()
      })

      it('handles database errors', async () => {
        // Mock database to throw an error
        mockEnv.DB.prepare = vi.fn().mockReturnValue({
          bind: vi.fn().mockReturnValue({
            first: vi.fn().mockRejectedValue(new Error('DB connection failed'))
          })
        })
        
        const result = await processor.getUserById('user-1')
        
        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
      })

      it('handles malformed user ID', async () => {
        // Test with various malformed IDs
        const malformedIds = ['', '   ', null as any, undefined as any]
        
        for (const id of malformedIds) {
          const result = await processor.getUserById(id)
          expect(result.success).toBe(false)
        }
      })
    })
  })

  describe('Random and Time-Dependent Functions', () => {
    describe('StringUtils.generateRandomString', () => {
      it('generates string of correct length', () => {
        [1, 5, 10, 50].forEach(length => {
          const result = StringUtils.generateRandomString(length)
          expect(result).toHaveLength(length)
        })
      })

      it('generates different strings on multiple calls', () => {
        const results = Array(10).fill(0).map(() => StringUtils.generateRandomString(10))
        const uniqueResults = new Set(results)
        
        // Should generate mostly unique strings (allowing for rare collisions)
        expect(uniqueResults.size).toBeGreaterThan(8)
      })

      it('uses only allowed characters', () => {
        const result = StringUtils.generateRandomString(100)
        const allowedChars = /^[A-Za-z0-9]+$/
        
        expect(allowedChars.test(result)).toBe(true)
      })

      it('handles edge cases', () => {
        expect(StringUtils.generateRandomString(0)).toBe('')
        expect(StringUtils.generateRandomString(1)).toHaveLength(1)
      })
    })

    describe('Time-dependent processing', () => {
      it('generates consistent timestamps when mocked', async () => {
        const fixedDate = new Date('2024-01-01T00:00:00.000Z')
        vi.setSystemTime(fixedDate)
        
        const userData = {
          email: 'test@example.com',
          name: 'Test User'
        }
        
        const processor = new DataProcessor(createMockEnv())
        const result = await processor.processUserData(userData)
        
        expect(result.success).toBe(true)
        expect(result.data?.createdAt).toBe(fixedDate.toISOString())
        
        vi.useRealTimers()
      })
    })
  })

  describe('Error Boundary Testing', () => {
    it('handles null and undefined inputs gracefully', async () => {
      const processor = new DataProcessor(createMockEnv())
      
      const nullResult = await processor.processUserData(null as any)
      expect(nullResult.success).toBe(false)
      
      const undefinedResult = await processor.processUserData(undefined as any)
      expect(undefinedResult.success).toBe(false)
    })

    it('handles malformed input objects', async () => {
      const processor = new DataProcessor(createMockEnv())
      
      const malformedInputs = [
        {},
        { email: null },
        { name: null },
        { email: 123 as any, name: true as any },
        { email: [], name: {} }
      ]
      
      for (const input of malformedInputs) {
        const result = await processor.processUserData(input as any)
        expect(result.success).toBe(false)
        expect(result.error).toBeDefined()
      }
    })

    it('handles extremely large inputs', async () => {
      const processor = new DataProcessor(createMockEnv())
      
      const largeInput = {
        email: 'test@example.com',
        name: 'A'.repeat(10000) // Very long name
      }
      
      const result = await processor.processUserData(largeInput)
      
      // Should handle gracefully (either process or reject with clear error)
      expect(result).toHaveProperty('success')
      if (result.success) {
        expect(result.data?.name).toBe(largeInput.name.trim())
      } else {
        expect(result.error).toBeDefined()
      }
    })
  })

  describe('Performance Testing', () => {
    it('processes data within reasonable time', async () => {
      const processor = new DataProcessor(createMockEnv())
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      }
      
      const startTime = performance.now()
      await processor.processUserData(userData)
      const endTime = performance.now()
      
      // Should complete within 100ms for simple operation
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('handles batch operations efficiently', async () => {
      const processor = new DataProcessor(createMockEnv())
      const batchSize = 100
      
      const operations = Array(batchSize).fill(0).map(async (_, i) => {
        return processor.processUserData({
          email: `user${i}@example.com`,
          name: `User ${i}`
        })
      })
      
      const startTime = performance.now()
      const results = await Promise.all(operations)
      const endTime = performance.now()
      
      // All operations should succeed
      expect(results.every(r => r.success)).toBe(true)
      
      // Should handle batch within reasonable time (adjust based on requirements)
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })
})