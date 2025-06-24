# Test Running and Debugging Guide

## Quick Start

### Running All Tests
```bash
# From project root - runs both frontend and backend tests
npm test

# With coverage reports
npm run test:coverage

# Watch mode for active development
npm run test:watch
```

### Running Specific Test Suites
```bash
# Frontend tests only
npm run test:frontend
npm run test:frontend:watch
npm run test:frontend:coverage

# Backend tests only  
npm run test:backend
npm run test:backend:watch
npm run test:backend:coverage
```

## Detailed Commands

### Frontend Testing Commands

#### From Project Root
```bash
npm run test:frontend              # Run all frontend tests once
npm run test:frontend:watch        # Watch mode with hot reload
npm run test:frontend:coverage     # Generate coverage report
```

#### From Frontend Directory
```bash
cd frontend
npm test                          # Run tests once
npm run test:watch               # Watch mode
npm run test:coverage            # Coverage report
npm run test:ui                  # Open Vitest UI (if configured)
```

#### Advanced Frontend Options
```bash
# Run specific test files
npm test -- LoginForm.test.tsx

# Run tests matching pattern
npm test -- --grep "authentication"

# Run tests with reporter options
npm test -- --reporter=verbose

# Run with specific timeout
npm test -- --testTimeout=10000

# Run in parallel/sequential
npm test -- --no-parallel
npm test -- --parallel
```

### Backend Testing Commands

#### From Project Root
```bash
npm run test:backend              # Run all backend tests once
npm run test:backend:watch        # Watch mode with hot reload
npm run test:backend:coverage     # Generate coverage report
```

#### From Backend Directory
```bash
cd backend
npm test                          # Run tests once
npm run test:watch               # Watch mode
npm run test:coverage            # Coverage report
```

#### Advanced Backend Options
```bash
# Run specific test files
npm test -- jwt.test.ts

# Run tests matching pattern
npm test -- --grep "database"

# Run with environment variables
NODE_ENV=test npm test

# Run with verbose output
npm test -- --reporter=verbose

# Run with different pools
npm test -- --pool=workers
```

## Test Filtering and Selection

### Running Specific Tests

#### By File Pattern
```bash
# Frontend
npm run test:frontend -- **/*LoginForm*

# Backend  
npm run test:backend -- **/*jwt*
```

#### By Test Name Pattern
```bash
# Run tests containing "authentication"
npm test -- --grep "authentication"

# Run tests matching exact pattern
npm test -- --grep "^should validate email$"

# Case insensitive matching
npm test -- --grep "AUTH" --grep-ignore-case
```

#### By Test File
```bash
# Single file
npm test src/components/__tests__/LoginForm.test.tsx

# Multiple files
npm test src/utils/__tests__/jwt.test.ts src/test/__tests__/auth-integration.test.ts
```

### Excluding Tests

```bash
# Skip tests matching pattern
npm test -- --grep "integration" --invert

# Skip specific files
npm test -- --exclude "**/integration/**"

# Skip slow tests (if tagged)
npm test -- --exclude-tags slow
```

## Watch Mode

### Frontend Watch Mode
```bash
npm run test:frontend:watch
```

**Watch Mode Features:**
- Automatically reruns tests when files change
- Optimized to only run tests affected by changes
- Interactive commands available in terminal:
  - Press `a` to run all tests
  - Press `f` to run only failed tests
  - Press `t` to filter by test name pattern
  - Press `p` to filter by filename pattern
  - Press `q` to quit watch mode

### Backend Watch Mode
```bash
npm run test:backend:watch
```

**Watch Mode Optimizations:**
- Monitors source files and test files
- Intelligently reruns only affected tests
- Faster startup for subsequent runs

### Watch Mode Configuration

#### Frontend (vitest.config.ts)
```typescript
export default defineConfig({
  test: {
    watch: {
      // Ignore files to improve performance
      ignored: ['**/node_modules/**', '**/dist/**'],
      // Only watch specific directories
      include: ['src/**'],
    },
  },
})
```

## Coverage Reports

### Generating Coverage
```bash
# All tests with coverage
npm run test:coverage

# Frontend only
npm run test:frontend:coverage

# Backend only
npm run test:backend:coverage
```

### Coverage Output Locations
```
frontend/coverage/          # Frontend coverage reports
backend/coverage/           # Backend coverage reports
```

### Coverage Report Formats

#### HTML Reports
- **Location**: `coverage/index.html`
- **Features**: Interactive browsing, line-by-line coverage, branch coverage
- **Usage**: Open in browser for detailed analysis

#### JSON Reports
- **Location**: `coverage/coverage-final.json`
- **Features**: Machine-readable format
- **Usage**: CI/CD integration, custom tooling

#### LCOV Reports
- **Location**: `coverage/lcov.info`
- **Features**: Standard format for coverage tools
- **Usage**: IDE integration, coverage badges

#### Text Reports
- **Features**: Terminal summary output
- **Usage**: Quick overview during development

### Coverage Thresholds

#### Backend Thresholds (70% minimum)
```typescript
coverage: {
  thresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

#### Checking Coverage
```bash
# Fail if coverage below threshold
npm run test:backend:coverage

# View current coverage status
npm run test:backend:coverage -- --reporter=text-summary
```

## Debugging Tests

### Basic Debugging Techniques

#### Console Debugging
```typescript
it('debugs test execution', () => {
  console.log('Debug info:', someVariable)
  console.table(objectData)
  console.trace('Execution path')
  
  expect(result).toBe(expected)
})
```

#### Frontend Component Debugging
```typescript
import { screen, debug } from '@testing-library/react'

it('debugs component rendering', () => {
  render(<MyComponent />)
  
  // Print entire DOM
  screen.debug()
  
  // Print specific element
  const button = screen.getByRole('button')
  screen.debug(button)
  
  // Get testing playground URL
  screen.logTestingPlaygroundURL()
})
```

#### Backend API Debugging
```typescript
it('debugs API responses', async () => {
  const response = await handleRequest(request, env, ctx)
  
  console.log('Status:', response.status)
  console.log('Headers:', [...response.headers.entries()])
  
  const text = await response.text()
  console.log('Body:', text)
  
  expect(response.ok).toBe(true)
})
```

### VSCode Integration

#### Install Extensions
- **Vitest Extension**: Official Vitest extension for VSCode
- **Test Explorer**: Visual test management
- **Coverage Gutters**: Inline coverage indicators

#### VSCode Test Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Frontend Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/node_modules/.bin/vitest",
      "args": ["--inspect-brk", "--no-coverage"],
      "cwd": "${workspaceFolder}/frontend",
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Backend Tests", 
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/node_modules/.bin/vitest",
      "args": ["--inspect-brk", "--no-coverage"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal"
    }
  ]
}
```

#### Using Breakpoints
1. Set breakpoints in test files or source code
2. Run debug configuration from VSCode
3. Use step-through debugging features
4. Inspect variables and call stack

### Browser DevTools Debugging

#### Frontend Tests in Browser
```bash
# Start dev server with test environment
npm run test:frontend -- --ui

# Access browser UI at http://localhost:51204
```

**Browser Features:**
- Visual test execution
- Real DOM inspection
- Network tab for API calls
- Console for debugging output

### Advanced Debugging

#### Mock Debugging
```typescript
// Debug mock calls
const mockFn = vi.fn()
mockFn('test', 123)

console.log('Mock calls:', mockFn.mock.calls)
console.log('Mock results:', mockFn.mock.results)
console.log('Call count:', mockFn.mock.calls.length)
```

#### Async Debugging
```typescript
// Debug timing issues
it('debugs async operations', async () => {
  console.time('async-operation')
  
  const result = await asyncOperation()
  
  console.timeEnd('async-operation')
  console.log('Result:', result)
})
```

#### Error Debugging
```typescript
// Capture and inspect errors
it('debugs error handling', async () => {
  try {
    await riskyOperation()
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
    throw error
  }
})
```

## Performance Testing

### Test Execution Performance

#### Timing Individual Tests
```typescript
it('measures test performance', async () => {
  const start = performance.now()
  
  await someOperation()
  
  const duration = performance.now() - start
  console.log(`Operation took ${duration}ms`)
  
  expect(duration).toBeLessThan(100) // Assert performance
})
```

#### Parallel vs Sequential
```bash
# Run tests in parallel (default)
npm test

# Run tests sequentially
npm test -- --no-parallel

# Control thread count
npm test -- --threads=4
```

### Memory Usage Monitoring

#### Node.js Memory Usage
```typescript
it('monitors memory usage', () => {
  const memBefore = process.memoryUsage()
  
  // Perform operation
  
  const memAfter = process.memoryUsage()
  console.log('Memory delta:', {
    rss: memAfter.rss - memBefore.rss,
    heapUsed: memAfter.heapUsed - memBefore.heapUsed
  })
})
```

### Load Testing Patterns

#### Concurrent Operations
```typescript
it('handles concurrent requests', async () => {
  const requests = Array(100).fill(0).map(() => 
    makeRequest()
  )
  
  const start = performance.now()
  const results = await Promise.all(requests)
  const duration = performance.now() - start
  
  expect(results.every(r => r.success)).toBe(true)
  expect(duration).toBeLessThan(5000)
})
```

## Common Issues and Solutions

### Test Flakiness

#### Timing Issues
```typescript
// ❌ Flaky - race condition
it('waits for async operation', () => {
  performAsyncOperation()
  expect(result).toBe(expected) // May fail randomly
})

// ✅ Reliable - proper waiting
it('waits for async operation', async () => {
  await waitFor(() => {
    expect(result).toBe(expected)
  })
})
```

#### State Cleanup
```typescript
// ❌ Tests affect each other
describe('StatefulComponent', () => {
  it('first test', () => {
    setState('value1')
    // Test doesn't clean up
  })
  
  it('second test', () => {
    // Inherits state from first test
  })
})

// ✅ Proper cleanup
describe('StatefulComponent', () => {
  beforeEach(() => {
    resetState()
  })
  
  afterEach(() => {
    cleanup()
  })
})
```

### Mock Issues

#### Mock Isolation
```typescript
// ❌ Mocks leak between tests
vi.mock('./module', () => ({ default: vi.fn() }))

// ✅ Proper mock cleanup
beforeEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  vi.restoreAllMocks()
})
```

#### Mock Timing
```typescript
// ❌ Mock applied too late
import { myFunction } from './module'
vi.mock('./module') // Too late!

// ✅ Proper mock timing
vi.mock('./module')
import { myFunction } from './module'
```

### Environment Issues

#### Node Version Compatibility
```bash
# Check Node version
node --version

# Use specific Node version
nvm use 18.17.0
npm test
```

#### Environment Variables
```bash
# Set test environment
NODE_ENV=test npm test

# Debug environment
npm test -- --debug-env
```

#### Dependency Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Update test dependencies
npm update @vitest/ui vitest
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run Tests
  run: npm test
  
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

### Local CI Simulation
```bash
# Run tests as CI would
CI=true npm test

# Run with CI flags
npm test -- --run --coverage
```

## Test Output Interpretation

### Success Output
```
✓ src/components/__tests__/LoginForm.test.tsx (6)
✓ src/utils/__tests__/jwt.test.ts (15)

Test Files  2 passed (2)
Tests       21 passed (21)
Duration    1.23s
```

### Failure Output
```
❌ src/components/__tests__/LoginForm.test.tsx > LoginForm > should validate inputs
AssertionError: expected 'Invalid email' to be 'Email is required'

- Expected: "Email is required"
+ Received: "Invalid email"

❯ src/components/__tests__/LoginForm.test.tsx:45:20
```

### Coverage Output
```
Coverage report from v8:
┌─────────────┬─────────┬─────────┬─────────┬─────────┬───────────────┐
│ File        │ % Stmts │ % Branch│ % Funcs │ % Lines │ Uncovered Line│
├─────────────┼─────────┼─────────┼─────────┼─────────┼───────────────┤
│ All files   │   85.5   │   78.2  │   90.1  │   85.5  │               │
│ utils       │   92.3   │   85.7  │   100   │   92.3  │               │
│  jwt.ts     │   92.3   │   85.7  │   100   │   92.3  │ 45-47         │
└─────────────┴─────────┴─────────┴─────────┴─────────┴───────────────┘
```

## Next Steps

1. **Set up your preferred debugging method** (VSCode, browser DevTools, or console)
2. **Configure watch mode** for efficient development
3. **Establish coverage monitoring** workflow
4. **Practice debugging techniques** with real test failures
5. **Integrate testing into your development routine**

For more specific debugging scenarios, refer to:
- [TESTING.md](../TESTING.md) - General testing patterns
- [Vitest Documentation](https://vitest.dev/guide/debugging.html) - Official debugging guide
- [React Testing Library](https://testing-library.com/docs/queries/about/#debugging) - Frontend debugging