import { Request, ExecutionContext, IncomingRequestCfProperties } from '@cloudflare/workers-types'
import { TestEnv } from './mock-env'
import { expect } from 'vitest'

/**
 * API testing utilities for Cloudflare Workers
 */
export class ApiTestUtils {
  private env: TestEnv

  constructor(env: TestEnv) {
    this.env = env
  }

  /**
   * Create a test request object
   */
  createRequest(method: string, url: string, options: RequestInit = {}): Request {
    const fullUrl = url.startsWith('http') ? url : `https://api.gourmoire.com${url}`
    
    return new Request(fullUrl, {
      method,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  }

  /**
   * Create a test request with JSON body
   */
  createJsonRequest(method: string, url: string, data: unknown, headers: Record<string, string> = {}): Request {
    return this.createRequest(method, url, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  }

  /**
   * Create a test request with authentication header
   */
  createAuthenticatedRequest(method: string, url: string, token: string, options: RequestInit = {}): Request {
    return this.createRequest(method, url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })
  }

  /**
   * Create authenticated JSON request
   */
  createAuthenticatedJsonRequest(method: string, url: string, data: unknown, token: string): Request {
    return this.createJsonRequest(method, url, data, {
      'Authorization': `Bearer ${token}`,
    })
  }

  /**
   * Create mock execution context
   */
  createExecutionContext(): ExecutionContext {
    return {
      waitUntil: () => {},
      passThroughOnException: () => {},
      // Mock props for testing
      cf: {} as IncomingRequestCfProperties,
      props: {} as Record<string, unknown>,
    } as ExecutionContext
  }

  /**
   * Parse response as JSON
   */
  async parseJsonResponse(response: Response): Promise<unknown> {
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch (error) {
      throw new Error(`Failed to parse response as JSON: ${text}`)
    }
  }

  /**
   * Assert response is successful JSON
   */
  async assertSuccessResponse(response: Response, expectedData?: unknown): Promise<unknown> {
    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Expected successful response, got ${response.status}: ${text}`)
    }

    const data = await this.parseJsonResponse(response)
    
    if (expectedData) {
      expect(data).toEqual(expectedData)
    }

    return data
  }

  /**
   * Assert response is error with specific status
   */
  async assertErrorResponse(response: Response, expectedStatus: number, expectedMessage?: string): Promise<unknown> {
    if (response.status !== expectedStatus) {
      const text = await response.text()
      throw new Error(`Expected status ${expectedStatus}, got ${response.status}: ${text}`)
    }

    const data = await this.parseJsonResponse(response)
    
    if (expectedMessage) {
      const errorData = data as { message?: string }
      expect(errorData.message).toContain(expectedMessage)
    }

    return data
  }

  /**
   * Get environment for testing
   */
  getEnv(): TestEnv {
    return this.env
  }

  /**
   * Set up test database
   */
  async setupDatabase(): Promise<void> {
    if (this.env.testDb) {
      await this.env.testDb.setup()
    }
  }

  /**
   * Clean up test database
   */
  async cleanupDatabase(): Promise<void> {
    if (this.env.testDb) {
      await this.env.testDb.cleanup()
    }
  }

  /**
   * Reset test database
   */
  async resetDatabase(): Promise<void> {
    if (this.env.testDb) {
      await this.env.testDb.reset()
    }
  }
}

/**
 * Create API test utilities
 */
export function createApiTestUtils(env: TestEnv): ApiTestUtils {
  return new ApiTestUtils(env)
}

/**
 * Common test data generators
 */
export const TestData = {
  /**
   * Generate test login credentials
   */
  loginCredentials: (overrides: Partial<{ username: string; password: string; rememberMe: boolean }> = {}) => ({
    username: 'testuser',
    password: 'testpassword',
    rememberMe: false,
    ...overrides,
  }),

  /**
   * Generate test user data
   */
  user: (overrides: Partial<{ id: string; username: string; email: string }> = {}) => ({
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    ...overrides,
  }),

  /**
   * Generate test recipe data
   */
  recipe: (overrides: Partial<Record<string, unknown>> = {}) => ({
    title: 'Test Recipe',
    description: 'A test recipe description',
    servings: 4,
    prepTime: 15,
    cookTime: 30,
    ingredients: [
      { quantity: '2', unit: 'cups', item: 'flour' },
      { quantity: '1', unit: 'cup', item: 'sugar' },
    ],
    instructions: [
      'Mix ingredients together',
      'Bake for 30 minutes',
    ],
    tags: ['dessert', 'baking'],
    ...overrides,
  }),
}

