import { D1Database } from '@cloudflare/workers-types'
import { createTestDatabase, TestDatabase } from './test-db'

export interface MockEnv {
  DB: MockD1Database | D1Database
  USERS_KV: MockKVNamespace
  RECIPES_KV: MockKVNamespace
  AUTH_KV: MockKVNamespace
  ENVIRONMENT: string
  JWT_SECRET: string
  JWT_REFRESH_SECRET: string
}

export interface TestEnv {
  DB: D1Database
  USERS_KV: MockKVNamespace
  RECIPES_KV: MockKVNamespace
  AUTH_KV: MockKVNamespace
  ENVIRONMENT: string
  JWT_SECRET: string
  JWT_REFRESH_SECRET: string
  testDb?: TestDatabase
}

// Mock D1 Database
export class MockD1Database {
  private data: Map<string, unknown[]> = new Map()

  prepare(_sql: string): MockD1PreparedStatement {
    return new MockD1PreparedStatement(_sql, this.data)
  }

  exec(_sql: string): MockD1ExecResult {
    return {
      results: [],
      success: true,
      meta: {},
      error: undefined
    }
  }

  dump(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0))
  }

  batch(_statements: unknown[]): Promise<unknown[]> {
    return Promise.resolve([])
  }

  withSession(_sessionId: string) {
    return this
  }
}

// Mock D1 Prepared Statement
export class MockD1PreparedStatement {
  constructor(private sql: string, private data: Map<string, unknown[]>) {}

  bind(..._values: unknown[]): MockD1PreparedStatement {
    return this
  }

  first<T = unknown>(_colName?: string): Promise<T | null> {
    return Promise.resolve(null)
  }

  run(): Promise<unknown> {
    return Promise.resolve({
      success: true,
      meta: {
        changes: 1,
        last_row_id: 1,
        duration: 0.1,
        size_after: 0,
        rows_read: 0,
        rows_written: 1
      }
    })
  }

  all<T = Record<string, unknown>>(): Promise<{ results: T[], success: boolean, meta: unknown }> {
    return Promise.resolve({
      results: [],
      success: true,
      meta: {}
    })
  }

  raw<T = unknown[]>(): Promise<T[]> {
    return Promise.resolve([])
  }
}

// Mock KV Namespace
export class MockKVNamespace {
  private data: Map<string, string> = new Map()

  get(key: string): Promise<string | null> {
    return Promise.resolve(this.data.get(key) || null)
  }

  put(key: string, value: string, _options?: unknown): Promise<void> {
    this.data.set(key, value)
    return Promise.resolve()
  }

  delete(key: string): Promise<void> {
    this.data.delete(key)
    return Promise.resolve()
  }

  list(): Promise<unknown> {
    return Promise.resolve({ keys: [] })
  }
}

export interface MockD1ExecResult {
  results: unknown[]
  success: boolean
  meta: unknown
  error?: string
}

export const createMockEnv = (): MockEnv => ({
  DB: new MockD1Database(),
  USERS_KV: new MockKVNamespace(),
  RECIPES_KV: new MockKVNamespace(),
  AUTH_KV: new MockKVNamespace(),
  ENVIRONMENT: 'test',
  JWT_SECRET: 'test-jwt-secret-key-for-testing',
  JWT_REFRESH_SECRET: 'test-refresh-secret-key-for-testing'
})

/**
 * Create test environment with real D1 database for integration testing
 * Must be used within Cloudflare Workers test environment
 */
export const createTestEnv = (db: D1Database): TestEnv => ({
  DB: db,
  USERS_KV: new MockKVNamespace(),
  RECIPES_KV: new MockKVNamespace(),
  AUTH_KV: new MockKVNamespace(),
  ENVIRONMENT: 'test',
  JWT_SECRET: 'test-jwt-secret-key-for-testing',
  JWT_REFRESH_SECRET: 'test-refresh-secret-key-for-testing',
  testDb: createTestDatabase(db)
})