import { vi } from 'vitest'

// Mock console methods to reduce noise in tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}