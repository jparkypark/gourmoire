# Testing Documentation Overview

This directory contains comprehensive testing documentation for the Gourmoire project.

## 📚 Documentation Files

### [TESTING.md](../../TESTING.md)
**Main testing guide** - Comprehensive overview of testing strategy, patterns, and best practices.
- Testing stack overview (Vitest, React Testing Library, MSW)
- Test organization and directory structure
- Testing patterns for frontend components and backend APIs
- Testing utilities and configuration
- Best practices and examples

### [TEST_RUNNING_GUIDE.md](./TEST_RUNNING_GUIDE.md)
**Operational guide** - How to run, debug, and troubleshoot tests.
- Command reference for running tests
- Watch mode and development workflow
- Coverage report generation
- Debugging techniques for frontend and backend
- Performance monitoring and optimization
- CI/CD integration

### [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md)
**Process guide** - Integrating testing into daily development.
- Test-driven development practices
- Bug fix and refactoring workflows
- Code review guidelines
- Quality gates and standards
- Performance considerations
- Common issues and solutions

## 🧪 Example Tests

### [examples/tests/](../../examples/tests/)
**Reference implementations** - Complete example tests demonstrating all patterns.

- **`frontend-component-example.test.tsx`** - React component testing patterns
- **`backend-api-example.test.ts`** - API endpoint integration testing patterns  
- **`backend-unit-example.test.ts`** - Backend utility and unit testing patterns

## 🚀 Quick Start

### For New Developers
1. **Read** [TESTING.md](../../TESTING.md) for overall strategy
2. **Set up** development environment with test running
3. **Review** example tests to understand patterns
4. **Follow** [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) for daily practices

### For Immediate Testing Needs
```bash
# Run all tests
npm test

# Start watch mode for development
npm run test:watch

# Generate coverage reports
npm run test:coverage

# Debug failing tests - see TEST_RUNNING_GUIDE.md
```

### For Writing New Tests
1. **Find similar patterns** in existing test files or examples
2. **Follow naming conventions** and organization structure
3. **Use testing utilities** provided in test helpers
4. **Ensure coverage** and quality standards are met

## 📖 Testing Philosophy

Our testing approach emphasizes:

- **Quality over quantity** - Focus on meaningful tests that prevent regressions
- **Test-driven development** - Write tests before or alongside code
- **Fast feedback loops** - Quick test execution for rapid development
- **Comprehensive coverage** - Unit, integration, and E2E testing where appropriate
- **Maintainable tests** - Clear, readable, and well-organized test code

## 🛠 Tools and Technologies

### Frontend Testing
- **Vitest** - Fast unit test runner with hot module replacement
- **React Testing Library** - Component testing focused on user interactions
- **MSW** - API mocking for isolated frontend testing
- **jsdom** - Browser environment simulation

### Backend Testing
- **Vitest with Cloudflare Workers** - Testing in actual runtime environment
- **D1 Database Testing** - In-memory database for isolated tests
- **API Test Utilities** - Custom helpers for endpoint testing
- **Coverage Reporting** - V8 provider with quality gates

## 📊 Coverage Standards

### Current Thresholds
- **Backend**: 70% minimum for branches, functions, lines, and statements
- **Frontend**: Coverage tracking enabled, quality-focused testing

### Coverage Reports
- **HTML Reports**: Interactive browsing with line-by-line coverage
- **CI Integration**: Automated coverage checking in pull requests
- **Coverage Trends**: Monitoring coverage changes over time

## 🔧 Development Integration

### VSCode Extensions
- **Vitest Extension** - Integrated test running and debugging
- **Test Explorer** - Visual test management
- **Coverage Gutters** - Inline coverage display

### Git Hooks
- **Pre-commit**: Linting, type checking, and test execution
- **Pre-push**: Full test suite and coverage verification

### GitHub Actions
- **Automated Testing**: Tests run on all pull requests
- **Coverage Reporting**: Coverage changes tracked and reported
- **Quality Gates**: Prevent merging if tests fail or coverage drops

## 📈 Metrics and Monitoring

### Test Performance
- **Execution Time**: Monitor test speed and optimize slow tests
- **Flaky Test Detection**: Identify and fix unreliable tests
- **Coverage Trends**: Track coverage changes over time

### Quality Indicators
- **Test Pass Rate**: Maintain high test reliability
- **Coverage Percentage**: Ensure adequate test coverage
- **Code Review Integration**: Testing considerations in all reviews

## 🤝 Contributing to Testing

### Adding New Tests
1. **Follow existing patterns** from examples and current tests
2. **Update documentation** when introducing new patterns
3. **Ensure quality standards** are met
4. **Get code review** focusing on test quality

### Improving Testing Infrastructure
1. **Identify pain points** in current testing workflow
2. **Propose improvements** with clear benefits
3. **Update documentation** to reflect changes
4. **Share knowledge** with the team

### Reporting Issues
1. **Document problems** with test execution or debugging
2. **Provide reproduction steps** for test failures
3. **Suggest solutions** when possible
4. **Update documentation** once resolved

## 📞 Getting Help

### When You Need Assistance
- **Check documentation** in this directory first
- **Review example tests** for similar patterns
- **Look at existing tests** in the codebase
- **Consult official tool documentation** (Vitest, React Testing Library)

### When Documentation is Unclear
- **Ask for clarification** in code reviews
- **Suggest improvements** to documentation
- **Share your learning** by updating docs
- **Create examples** for common use cases

---

**Remember**: Good tests enable confident development and refactoring. Invest time in testing to save time in debugging and maintenance.