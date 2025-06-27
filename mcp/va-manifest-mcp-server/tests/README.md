# Test Suite Documentation

This directory contains comprehensive tests for the VA.gov Manifest Catalog MCP Server, ensuring compatibility across different Node.js and MCP SDK versions.

## Test Structure

### Test Files

- **`index.js`** - Main test runner that orchestrates all test suites
- **`compatibility.test.js`** - Environment compatibility tests (Node.js version, MCP SDK version)
- **`imports.test.js`** - SDK import functionality tests (dynamic imports, component availability)
- **`server.test.js`** - Server functionality tests (initialization, tools, status)
- **`upgrade-sdk.js`** - SDK version management utility

## Running Tests

### All Tests
```bash
npm test
# or
npm run test:all
# or
node tests/index.js
```

### Individual Test Suites
```bash
# Compatibility tests only
npm run test:compatibility
node tests/compatibility.test.js

# Import tests only
npm run test:imports
node tests/imports.test.js

# Server tests only
npm run test:server
node tests/server.test.js
```

### Quick Tests (imports + compatibility)
```bash
npm run test:quick
```

### Version Information
```bash
npm run test:version-info
```

## Test Categories

### 1. Compatibility Tests (`compatibility.test.js`)

Tests environment compatibility and version requirements:

- **Node.js Version Test**: Verifies Node.js >= 14.15.0
- **MCP SDK Version Test**: Checks for supported MCP SDK versions
- **SDK Import Test**: Tests dynamic import functionality
- **Server Initialization Test**: Validates server can be created and initialized
- **Version Information Test**: Retrieves and validates version metadata

### 2. Import Tests (`imports.test.js`)

Tests the dynamic import system for MCP SDK components:

- **Basic Import Test**: Verifies SDK can be imported successfully
- **Required Components Test**: Checks all required MCP components are available
- **Component Types Test**: Validates component types match expectations
- **Version Detection Test**: Tests version detection and import path logic
- **Multiple Imports Test**: Ensures import consistency across multiple calls

### 3. Server Tests (`server.test.js`)

Tests server functionality and integration:

- **Server Import Test**: Verifies server module can be imported
- **Server Construction Test**: Tests server instance creation
- **Server Initialization Test**: Validates server initialization with MCP SDK
- **Server Status Test**: Tests status reporting functionality
- **Tools Integration Test**: Verifies tool registration and categorization
- **Server Cleanup Test**: Tests proper cleanup and resource management

## SDK Version Management

### Upgrade SDK
```bash
# Upgrade to latest version
npm run upgrade-sdk

# Get version information
npm run upgrade-sdk:info

# Test current SDK version
npm run upgrade-sdk:test

# Check available versions
npm run check-sdk-versions
```

### Manual SDK Management
```bash
# Test specific version
node tests/upgrade-sdk.js test 1.0.0

# Install specific version
node tests/upgrade-sdk.js install 1.0.0

# Get detailed info
node tests/upgrade-sdk.js info
```

## Test Output

Tests provide colored console output with clear success/failure indicators:

- ✓ Green checkmarks for passing tests
- ✗ Red X marks for failing tests
- ⚠ Yellow warnings for non-critical issues
- ℹ Blue info messages for additional context

## Environment Requirements

### Supported Node.js Versions
- **Minimum**: Node.js 14.15.0
- **Recommended**: Node.js 16+ for best performance
- **Tested**: Node.js 14.15.0, 16.x, 18.x, 20.x

### Supported MCP SDK Versions
- **Current**: 0.5.0 (installed)
- **Supported Range**: >=0.5.0 <2.0.0
- **Latest Available**: 1.13.1
- **Compatibility**: Automatic version detection and import path adjustment

## Troubleshooting

### Common Issues

1. **Import Errors**: Usually caused by incorrect MCP SDK version or missing dependencies
   ```bash
   npm run test:imports
   ```

2. **Compatibility Issues**: Check Node.js version and MCP SDK compatibility
   ```bash
   npm run test:compatibility
   ```

3. **Server Initialization Failures**: Verify working directory and vets-website structure
   ```bash
   npm run test:server
   ```

### Debug Information

Get detailed version and environment information:
```bash
npm run test:version-info
```

### Upgrade SDK for Better Compatibility

If using an older MCP SDK version, upgrade for better compatibility:
```bash
npm run upgrade-sdk
npm test
```

## CI/CD Integration

These tests are designed to be run in CI environments:

```bash
# Exit code 0 on success, 1 on failure
node tests/index.js

# Run specific test suite
node tests/index.js compatibility
node tests/index.js imports
node tests/index.js server
```

## Adding New Tests

To add new tests:

1. Create a new test file in the `tests/` directory
2. Follow the existing pattern with colored output and test functions
3. Export a `runAll*Tests()` function that returns `{ passed, failed, total }`
4. Add the test suite to `tests/index.js`
5. Update package.json scripts if needed

Example test function:
```javascript
export async function testNewFeature() {
  logInfo('Testing new feature...');
  
  try {
    // Test implementation
    const result = await someTestOperation();
    
    if (result) {
      logSuccess('New feature works correctly');
      return true;
    } else {
      logError('New feature failed');
      return false;
    }
  } catch (error) {
    logError(`New feature test failed: ${error.message}`);
    return false;
  }
}
```
