# Testing in Development Workflow

## Overview

This guide integrates testing practices into the daily development workflow for Gourmoire. Following these guidelines ensures code quality, prevents regressions, and maintains a sustainable development pace.

## Development Cycle with Testing

### 1. Feature Development Workflow

#### Before Starting Development
```bash
# 1. Ensure all existing tests pass
npm test

# 2. Start watch mode for rapid feedback
npm run test:watch

# 3. Check current coverage
npm run test:coverage
```

#### During Development (Test-Driven Development)
```bash
# 1. Write failing test first
# 2. Write minimal code to pass test
# 3. Refactor while keeping tests green
# 4. Repeat cycle
```

**TDD Example Flow:**
```typescript
// 1. Write failing test
it('should validate recipe title', () => {
  expect(validateRecipeTitle('')).toEqual({
    isValid: false,
    error: 'Title is required'
  })
})

// 2. Run test (should fail)
npm test -- validateRecipeTitle

// 3. Write minimal code
function validateRecipeTitle(title: string) {
  if (!title) {
    return { isValid: false, error: 'Title is required' }
  }
  return { isValid: true }
}

// 4. Run test (should pass)
npm test -- validateRecipeTitle

// 5. Refactor and add more test cases
```

#### After Feature Completion
```bash
# 1. Run full test suite
npm test

# 2. Check coverage hasn't decreased
npm run test:coverage

# 3. Verify tests for edge cases
npm test -- --reporter=verbose

# 4. Clean up any debug code or skipped tests
```

### 2. Bug Fix Workflow

#### Bug Investigation
```bash
# 1. Reproduce bug with a failing test
it('reproduces bug: user cannot login with valid credentials', async () => {
  // Write test that demonstrates the bug
  const result = await login('validuser', 'validpass')
  expect(result.success).toBe(true) // This should fail initially
})

# 2. Run the failing test to confirm bug
npm test -- "reproduces bug"

# 3. Fix the bug

# 4. Verify test now passes
npm test -- "reproduces bug"

# 5. Add additional tests for related scenarios
```

#### Regression Prevention
```typescript
describe('Login Bug Fix - Regression Tests', () => {
  it('handles valid credentials correctly', () => {
    // Original fix
  })
  
  it('still rejects invalid credentials', () => {
    // Ensure fix didn't break existing functionality
  })
  
  it('handles edge cases around the bug', () => {
    // Test boundary conditions
  })
})
```

### 3. Refactoring Workflow

#### Safe Refactoring Process
```bash
# 1. Ensure all tests pass before refactoring
npm test

# 2. Keep tests running in watch mode
npm run test:watch

# 3. Refactor in small steps
# 4. Tests should remain green throughout
# 5. If tests break, fix immediately or revert

# 6. After refactoring, run full suite
npm test

# 7. Consider adding tests for new code paths
```

#### Refactoring Confidence Indicators
- ✅ All existing tests pass
- ✅ Coverage hasn't decreased
- ✅ No new linting errors
- ✅ Performance hasn't degraded

## Daily Development Practices

### Morning Routine
```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Run full test suite to verify clean state
npm test

# 4. Check if any tests are failing
# 5. Fix failing tests before starting new work
```

### During Development
```bash
# Keep tests running in background
npm run test:watch

# Run specific tests while working on feature
npm test -- LoginForm

# Check coverage for current work
npm run test:coverage -- --include="src/components/LoginForm*"
```

### Before Commits
```bash
# 1. Run full test suite
npm test

# 2. Check linting
npm run lint

# 3. Check types
npm run type-check

# 4. Verify coverage hasn't dropped significantly
npm run test:coverage
```

### End of Day
```bash
# Ensure clean state for next day
npm test
git status
```

## Testing Standards and Quality Gates

### Pre-Commit Requirements
All commits must meet these criteria:
- ✅ All tests pass
- ✅ New code has test coverage
- ✅ Coverage thresholds maintained (70% for backend)
- ✅ No linting errors
- ✅ No TypeScript errors

### Pre-Push Requirements
Before pushing to remote:
- ✅ Full test suite passes
- ✅ Integration tests pass
- ✅ Performance tests within acceptable ranges
- ✅ Documentation updated for new features

### Definition of Done
A feature is complete when:
- ✅ Feature functionality implemented
- ✅ Unit tests written and passing
- ✅ Integration tests added where needed
- ✅ Error handling tested
- ✅ Edge cases covered
- ✅ Documentation updated
- ✅ Code reviewed and approved

## Test Categories and When to Write Them

### Unit Tests (Write Always)
**When**: For every new function, method, or component
**Coverage**: Aim for 80%+ on new code

```typescript
// Write unit tests for:
- Pure functions
- Component logic
- Utility functions
- Business logic
- Error handling
- Edge cases
```

### Integration Tests (Write Strategically)
**When**: For critical user flows and API endpoints
**Coverage**: Focus on happy path and key error scenarios

```typescript
// Write integration tests for:
- API endpoint workflows
- Database operations
- Authentication flows
- Key user journeys
- Inter-component communication
```

### End-to-End Tests (Write Sparingly)
**When**: For critical business processes
**Coverage**: Main user workflows only

```typescript
// Write E2E tests for:
- Complete user login flow
- Recipe creation and viewing
- Search functionality
- Critical error scenarios
```

## Code Review and Testing

### Reviewer Checklist
When reviewing code, verify:
- [ ] New code has appropriate tests
- [ ] Tests cover edge cases and error conditions
- [ ] Test names are descriptive and clear
- [ ] Tests are properly isolated (no dependencies between tests)
- [ ] Mock usage is appropriate and realistic
- [ ] Coverage hasn't decreased significantly
- [ ] Performance tests included for performance-critical changes

### Testing-Specific Review Comments
```typescript
// ❌ Poor test
it('works', () => {
  expect(func()).toBeTruthy()
})

// ✅ Good test
it('returns user data when valid ID provided', async () => {
  const user = await getUserById('valid-id')
  expect(user).toEqual({
    id: 'valid-id',
    name: expect.any(String),
    email: expect.any(String)
  })
})
```

## Continuous Integration Integration

### GitHub Actions Integration
Tests run automatically on:
- Pull request creation
- Pull request updates
- Pushes to main branch

### Local Simulation of CI
```bash
# Run tests exactly as CI does
CI=true npm test

# Run with coverage as CI does
CI=true npm run test:coverage

# Check if coverage meets requirements
npm run test:coverage -- --check-coverage
```

### CI Failure Response
When CI tests fail:
1. **Don't ignore** - investigate immediately
2. **Reproduce locally** - ensure you can recreate the failure
3. **Fix root cause** - don't just make tests pass
4. **Consider additional tests** - prevent similar failures

## Performance Considerations

### Test Performance
```bash
# Monitor test execution time
npm test -- --reporter=verbose

# Identify slow tests
npm test -- --reporter=verbose | grep -E "✓.*[0-9]{3,}ms"

# Run tests with performance metrics
npm test -- --reporter=detailed
```

### Optimization Strategies
- **Parallel execution**: Keep test files independent
- **Mock external dependencies**: Avoid real network calls
- **Use test doubles**: Mock databases, APIs, file systems
- **Selective test running**: Only run tests affected by changes

### Performance Budgets
- Unit tests: < 10ms each
- Integration tests: < 100ms each
- Full test suite: < 30 seconds
- Watch mode startup: < 5 seconds

## Common Workflow Issues and Solutions

### Issue: Tests Pass Locally But Fail in CI
**Solutions:**
```bash
# 1. Check environment differences
NODE_ENV=test npm test

# 2. Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test

# 3. Check for timing issues
npm test -- --no-parallel

# 4. Check for absolute vs relative paths
npm test -- --config=./ci-config.js
```

### Issue: Slow Test Execution
**Solutions:**
```bash
# 1. Identify slow tests
npm test -- --reporter=verbose

# 2. Check for unnecessary database operations
# 3. Verify mocks are working
# 4. Consider test parallelization

# 5. Profile test execution
npm test -- --profile
```

### Issue: Flaky Tests
**Solutions:**
```typescript
// 1. Add proper waits
await waitFor(() => {
  expect(element).toBeInTheDocument()
})

// 2. Clean up state between tests
beforeEach(() => {
  cleanup()
  resetMocks()
})

// 3. Use deterministic test data
const fixedDate = new Date('2024-01-01')
vi.setSystemTime(fixedDate)
```

### Issue: Low Test Coverage
**Solutions:**
```bash
# 1. Identify uncovered code
npm run test:coverage

# 2. Add missing tests systematically
npm test -- --coverage --reporter=lcov

# 3. Focus on critical paths first
# 4. Use coverage tools to guide testing
```

## Best Practices Summary

### Do's ✅
- Write tests before or alongside code
- Keep tests simple and focused
- Use descriptive test names
- Clean up after tests
- Mock external dependencies
- Run tests frequently
- Maintain test code quality
- Test error conditions
- Use appropriate test types

### Don'ts ❌
- Skip writing tests for "simple" code
- Write tests that depend on each other
- Test implementation details
- Ignore failing tests
- Write overly complex test setup
- Mock everything unnecessarily
- Let coverage drop without justification
- Write tests just for coverage metrics
- Commit failing tests

## Tools and IDE Integration

### Recommended VSCode Extensions
- **Vitest**: Official Vitest extension
- **Test Explorer**: Visual test management
- **Coverage Gutters**: Inline coverage display
- **Error Lens**: Inline error display

### Keyboard Shortcuts
Set up shortcuts for common testing tasks:
- `Ctrl+Shift+T`: Run current test file
- `Ctrl+Shift+A`: Run all tests
- `Ctrl+Shift+D`: Debug current test
- `Ctrl+Shift+C`: Show coverage

### Terminal Aliases
Add to your shell configuration:
```bash
alias tt="npm test"
alias tw="npm run test:watch"
alias tc="npm run test:coverage"
alias tf="npm run test:frontend"
alias tb="npm run test:backend"
```

## Getting Help

### When Tests Are Unclear
1. **Check existing examples** in the codebase
2. **Review documentation** in `TESTING.md`
3. **Look at similar test patterns** in the project
4. **Ask for clarification** in code reviews
5. **Refer to testing library documentation**

### When Tests Are Failing
1. **Read error messages carefully**
2. **Use debugging techniques** from `TEST_RUNNING_GUIDE.md`
3. **Check recent changes** that might have caused issues
4. **Verify test environment** is set up correctly
5. **Consider if test or code needs updating**

### When Adding New Test Types
1. **Follow existing patterns** in the codebase
2. **Add documentation** for new patterns
3. **Update this guide** with new practices
4. **Share knowledge** with the team

## Conclusion

Testing is an integral part of the development process, not an afterthought. By following these workflow guidelines, you'll:

- **Catch bugs early** in the development cycle
- **Refactor with confidence** knowing tests will catch regressions
- **Document behavior** through comprehensive test suites
- **Improve code quality** through test-driven practices
- **Maintain velocity** over the long term

Remember: **Good tests enable fast development, not slow it down.**