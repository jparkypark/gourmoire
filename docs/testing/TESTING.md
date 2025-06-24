# Gourmoire Testing Guide

## Overview

This guide covers testing patterns, best practices, and documentation for the Gourmoire project. Our testing strategy ensures reliable code quality across both frontend (React) and backend (Cloudflare Workers) components.

## Testing Stack

### Frontend Testing
- **Framework**: Vitest with jsdom environment
- **Testing Library**: React Testing Library
- **Mocking**: MSW (Mock Service Worker) for API mocking
- **Coverage**: V8 provider with HTML, JSON, text, and lcov reports
- **Utilities**: Custom render function with all providers

### Backend Testing
- **Framework**: Vitest with Cloudflare Workers pool
- **Environment**: Cloudflare Workers test environment
- **Database**: In-memory D1 database for testing
- **Coverage**: Disabled (V8 provider compatibility issues with Workers environment)
- **Utilities**: API test utils and mock environment

## Test Organization

### Directory Structure
```
frontend/
├── src/
│   ├── components/
│   │   └── __tests__/          # Component tests
│   ├── test/
│   │   ├── setup.ts            # Test configuration
│   │   ├── utils/
│   │   │   └── test-utils.tsx  # Custom render utilities
│   │   └── mocks/
│   │       ├── handlers.ts     # MSW request handlers
│   │       └── server.ts       # MSW server setup
│   └── utils/
│       └── __tests__/          # Utility function tests

backend/
├── src/
│   ├── test/
│   │   ├── setup.ts            # Test configuration
│   │   ├── helpers/
│   │   │   ├── test-db.ts      # Database test utilities
│   │   │   ├── api-test-utils.ts # API testing utilities
│   │   │   └── mock-env.ts     # Mock environment
│   │   ├── stubs/
│   │   │   └── bcryptjs.ts     # Library stubs for testing
│   │   └── __tests__/          # Integration tests
│   └── utils/
│       └── __tests__/          # Unit tests
```

## Testing Patterns

### 1. Frontend Component Testing

#### Basic Component Test Pattern
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/utils/test-utils'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with required props', () => {
    render(<MyComponent title="Test Title" />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    const onSubmit = vi.fn()
    render(<MyComponent onSubmit={onSubmit} />)
    
    const button = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(/* expected args */)
    })
  })
})
```

#### Context-Dependent Component Testing
```typescript
import { vi } from 'vitest'
import { useAuth } from '../../contexts/AuthContext'

// Mock context hooks
vi.mock('../../contexts/AuthContext', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useAuth: vi.fn(),
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  }
})

const mockUseAuth = vi.mocked(useAuth)

describe('AuthenticatedComponent', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      state: { isAuthenticated: true, user: { id: '1' } },
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    })
  })

  // Tests...
})
```

### 2. Backend Unit Testing

#### Utility Function Testing
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { MyUtility } from '../my-utility'
import { createMockEnv } from '../../test/helpers/mock-env'

describe('MyUtility', () => {
  let utility: MyUtility
  let mockEnv: ReturnType<typeof createMockEnv>

  beforeEach(() => {
    mockEnv = createMockEnv()
    utility = new MyUtility(mockEnv as any)
  })

  it('performs operation correctly', async () => {
    const input = { test: 'data' }
    const result = await utility.process(input)
    
    expect(result).toEqual({ processed: true, data: input })
  })

  it('handles error cases', async () => {
    const result = await utility.process(null)
    
    expect(result).toHaveProperty('success', false)
    expect(result).toHaveProperty('error')
  })
})
```

### 3. Backend API Integration Testing

#### API Endpoint Testing Pattern
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createApiTestUtils, TestData } from '../../test/helpers/api-test-utils'
import { createMockEnv } from '../../test/helpers/mock-env'
import { handleRequest } from '../../../index'

describe('API Endpoint Integration', () => {
  let apiUtils: ReturnType<typeof createApiTestUtils>
  let mockEnv: ReturnType<typeof createMockEnv>

  beforeEach(async () => {
    mockEnv = createMockEnv()
    apiUtils = createApiTestUtils(mockEnv)
    await apiUtils.setupDatabase()
  })

  afterEach(async () => {
    await apiUtils.cleanupDatabase()
  })

  it('creates resource successfully', async () => {
    const testData = TestData.recipe()
    const request = apiUtils.createJsonRequest('POST', '/api/recipes', testData)
    const ctx = apiUtils.createExecutionContext()

    const response = await handleRequest(request, mockEnv, ctx)
    const result = await apiUtils.assertSuccessResponse(response)

    expect(result).toMatchObject({
      id: expect.any(String),
      title: testData.title,
      description: testData.description,
    })
  })

  it('handles authentication requirement', async () => {
    const request = apiUtils.createRequest('GET', '/api/recipes')
    const ctx = apiUtils.createExecutionContext()

    const response = await handleRequest(request, mockEnv, ctx)

    await apiUtils.assertErrorResponse(response, 401, 'Authorization required')
  })
})
```

### 4. Database Testing

#### Database Operation Testing
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { TestDatabase } from '../../test/helpers/test-db'

describe('Database Operations', () => {
  let testDb: TestDatabase

  beforeEach(async () => {
    testDb = new TestDatabase()
    await testDb.setup()
  })

  afterEach(async () => {
    await testDb.cleanup()
  })

  it('inserts and retrieves data correctly', async () => {
    const testData = { name: 'Test Recipe', description: 'Test Description' }
    
    const insertResult = await testDb.db.prepare(
      'INSERT INTO recipes (name, description) VALUES (?, ?) RETURNING *'
    ).bind(testData.name, testData.description).first()

    expect(insertResult).toMatchObject(testData)

    const retrieveResult = await testDb.db.prepare(
      'SELECT * FROM recipes WHERE id = ?'
    ).bind(insertResult.id).first()

    expect(retrieveResult).toEqual(insertResult)
  })
})
```

## Testing Utilities

### Frontend Test Utilities

#### Custom Render Function
Located in `frontend/src/test/utils/test-utils.tsx`:
- Wraps components with all necessary providers (Router, Mantine, Auth, etc.)
- Provides consistent testing environment
- Re-exports all React Testing Library utilities

#### MSW Setup
Located in `frontend/src/test/mocks/`:
- Mock API responses for consistent testing
- Handlers for authentication and data operations
- Server configuration for test environment

### Backend Test Utilities

#### Mock Environment
Located in `backend/src/test/helpers/mock-env.ts`:
- Creates isolated test environment
- Provides mock KV stores and D1 database
- Configures test-specific settings

#### API Test Utils
Located in `backend/src/test/helpers/api-test-utils.ts`:
- Request builders for common patterns
- Response assertion helpers
- Database setup/cleanup utilities
- Test data generators

#### Test Database
Located in `backend/src/test/helpers/test-db.ts`:
- In-memory D1 database for testing
- Schema migration and seeding
- Isolation between tests

## Running Tests

### Command Reference

#### Frontend Tests
```bash
# From project root
npm run test --workspace=frontend    # Run frontend tests
npm run test:watch --workspace=frontend  # Watch mode (frontend only)
npm run test:coverage               # Frontend coverage only

# From frontend directory
npm test                           # Run tests
npm run test:watch                # Watch mode
npm run test:coverage             # Coverage report
```

#### Backend Tests
```bash
# From project root
npm run test --workspace=backend    # Run backend tests
npm run test:watch --workspace=backend  # Watch mode (backend only)
# Note: Backend coverage disabled due to Workers environment compatibility

# From backend directory
npm test                           # Run tests
npm run test:watch                # Watch mode
# npm run test:coverage - Disabled for Workers environment
```

#### All Tests
```bash
# From project root
npm test                      # Run all tests (frontend + backend)
npm run test:watch           # Watch all tests (frontend + backend)
npm run test:coverage        # Coverage for frontend only
npm run test:coverage-full   # Attempt coverage for both (backend will have issues)

# Additional convenience commands
npm run quality-check        # Lint + type-check + tests
npm run test:quick          # Same as npm test
npm run test:ui             # Open Vitest UI for both workspaces
```

### Test Execution Guidelines

1. **Run tests frequently** during development
2. **Use watch mode** for active development
3. **Check coverage reports** to identify untested code
4. **Run full test suite** before committing
5. **Ensure all tests pass** before pushing

## Coverage Requirements

### Minimum Thresholds
- **Backend**: V8 coverage disabled (Cloudflare Workers compatibility issues)
- **Frontend**: 70% for branches, functions, lines, and statements (V8 provider)
- **Quality Gates**: Tests must pass and meet coverage requirements

### Coverage Reports
- **HTML**: Interactive coverage reports in `coverage/` directories
- **JSON**: Machine-readable coverage data
- **LCOV**: For CI/CD integration
- **Text**: Console output summary

## Best Practices

### Test Organization
1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests focused** on single behaviors
5. **Use beforeEach/afterEach** for setup and cleanup

### Mocking Guidelines
1. **Mock external dependencies** (APIs, libraries)
2. **Use vi.fn()** for function mocks
3. **Reset mocks** between tests with `vi.clearAllMocks()`
4. **Mock at the module level** for consistent behavior
5. **Provide realistic mock data** that matches production

### Assertion Best Practices
1. **Use specific matchers** (`toEqual`, `toContain`, etc.)
2. **Test both success and error cases**
3. **Verify side effects** (function calls, state changes)
4. **Use `waitFor`** for asynchronous operations
5. **Check accessibility** with React Testing Library queries

### Database Testing
1. **Use isolated test databases** for each test
2. **Clean up after each test** to prevent interference
3. **Test database constraints** and validation
4. **Verify data integrity** across operations
5. **Test transaction rollbacks** for error cases

## Debugging Tests

### Common Debugging Techniques

#### Frontend Debugging
```typescript
import { screen, debug } from '@testing-library/react'

it('debugs component output', () => {
  render(<MyComponent />)
  
  // Print current DOM structure
  screen.debug()
  
  // Print specific element
  const element = screen.getByRole('button')
  screen.debug(element)
  
  // Use queries to understand what's available
  screen.logTestingPlaygroundURL()
})
```

#### Backend Debugging
```typescript
it('debugs API response', async () => {
  const response = await handleRequest(request, env, ctx)
  
  // Log response details
  console.log('Status:', response.status)
  console.log('Headers:', [...response.headers.entries()])
  console.log('Body:', await response.text())
  
  // Use debugger for step-through debugging
  // debugger;
})
```

### VSCode Integration
1. **Install Vitest extension** for integrated test running
2. **Use built-in debugger** with breakpoints
3. **Configure launch.json** for test debugging
4. **Use Test Explorer** for visual test management

## CI/CD Integration

### GitHub Actions
Tests are configured to run automatically on:
- Pull request creation and updates
- Pushes to main branch
- Manual workflow triggers

### Quality Gates
- All tests must pass
- Coverage thresholds must be met
- Linting and type checking must pass
- No critical security vulnerabilities

### Performance Considerations
- **Parallel execution** where possible
- **Selective test running** based on changed files
- **Caching** of dependencies and build artifacts
- **Timeout management** for long-running tests

## Example Test Files

See the following files for complete examples:
- **Frontend Component**: `frontend/src/components/__tests__/LoginForm.test.tsx`
- **Backend Unit**: `backend/src/utils/__tests__/jwt.test.ts`
- **Backend Integration**: `backend/src/test/__tests__/database-operations.test.ts`

## Next Steps

After reading this guide:
1. **Review existing test files** to understand patterns
2. **Set up your development environment** with test runners
3. **Write tests for new features** following these patterns
4. **Contribute to test coverage** by adding tests for untested code
5. **Ask questions** if patterns are unclear or need refinement

## Development Automation

### Pre-commit Hooks
The project uses Husky and lint-staged for automated quality checks:

```bash
# Pre-commit hook runs on every commit
# - Linting (ESLint)
# - Type checking (TypeScript)
# - Quick test run (all tests)
```

**Configuration**: `.husky/pre-commit` and `package.json` lint-staged section

### Quality Check Commands
Quick commands for development workflow:

```bash
# Run all quality checks (lint + type-check + test)
npm run quality-check

# Quick test run without coverage
npm run test:quick

# Watch mode for tests during development
npm run test:watch

# UI test runner
npm run test:ui
```

### Coverage Thresholds
Frontend enforces minimum coverage thresholds (V8 provider):
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

Backend coverage is currently disabled due to Cloudflare Workers environment compatibility issues with the V8 coverage provider.

Tests will fail if frontend coverage drops below these thresholds.

### Test Performance Optimization
- **Watch mode** with `clearScreen: false` for better feedback
- **Quick test scripts** for fast feedback during development
- **Selective running** based on file changes (lint-staged)
- **Parallel execution** for workspace tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Cloudflare Workers Testing](https://developers.cloudflare.com/workers/testing/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)