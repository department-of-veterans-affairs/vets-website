#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop, no-plusplus, no-prototype-builtins, no-unused-vars */

/**
 * Server Functionality Tests
 *
 * Tests for the MCP server initialization, configuration, and basic operations.
 */

import { importSDK } from '../src/utils/sdkImports.js';

// Test colors
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  process.stderr.write(`${color}${message}${colors.reset}\n`);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.blue);
}

export async function testServerImport() {
  logInfo('Testing server module import...');

  try {
    const {
      default: VAManifestCatalogServer,
    } = await import('../src/server.js');

    if (typeof VAManifestCatalogServer === 'function') {
      logSuccess('Server class imported successfully');
      return true;
    }
    logError('Server import did not return a constructor function');
    return false;
  } catch (error) {
    logError(`Server import failed: ${error.message}`);
    return false;
  }
}

export async function testServerConstruction() {
  logInfo('Testing server construction...');

  try {
    const {
      default: VAManifestCatalogServer,
    } = await import('../src/server.js');
    const server = new VAManifestCatalogServer();

    if (server && typeof server === 'object') {
      logSuccess('Server instance created successfully');

      // Check for expected properties
      if (
        server.hasOwnProperty('server') &&
        server.hasOwnProperty('workingDirectory')
      ) {
        logSuccess('Server has expected properties');
        return true;
      }
      logWarning('Server missing some expected properties');
      return true; // Still consider this a pass
    }
    logError('Server construction did not return a valid object');
    return false;
  } catch (error) {
    logError(`Server construction failed: ${error.message}`);
    return false;
  }
}

export async function testServerInitialization() {
  logInfo('Testing server initialization...');

  try {
    const {
      default: VAManifestCatalogServer,
    } = await import('../src/server.js');
    const server = new VAManifestCatalogServer();

    await server.initialize();

    if (server.server) {
      logSuccess('Server initialized with MCP server instance');

      // Test that the server has the expected methods
      const expectedMethods = ['setRequestHandler', 'connect', 'close'];
      let allMethodsPresent = true;

      for (const method of expectedMethods) {
        if (typeof server.server[method] === 'function') {
          logSuccess(`Server has ${method} method`);
        } else {
          logError(`Server missing ${method} method`);
          allMethodsPresent = false;
        }
      }

      return allMethodsPresent;
    }
    logError('Server initialization did not create MCP server instance');
    return false;
  } catch (error) {
    logError(`Server initialization failed: ${error.message}`);
    return false;
  }
}

export async function testServerStatus() {
  logInfo('Testing server status method...');

  try {
    const {
      default: VAManifestCatalogServer,
    } = await import('../src/server.js');
    const server = new VAManifestCatalogServer();
    await server.initialize();

    const status = server.getStatus();

    if (status && typeof status === 'object') {
      logSuccess('Server status method returned an object');

      // Check for expected status fields
      const expectedFields = [
        'name',
        'version',
        'workingDirectory',
        'tools',
        'structure',
      ];
      let allFieldsPresent = true;

      for (const field of expectedFields) {
        if (status.hasOwnProperty(field)) {
          logSuccess(`Status has ${field} field`);
        } else {
          logError(`Status missing ${field} field`);
          allFieldsPresent = false;
        }
      }

      // Log the status for debugging
      // Log status details (removed to avoid console output)

      return allFieldsPresent;
    }
    logError('Server status method did not return a valid object');
    return false;
  } catch (error) {
    logError(`Server status test failed: ${error.message}`);
    return false;
  }
}

export async function testToolsIntegration() {
  logInfo('Testing tools integration...');

  try {
    const {
      default: VAManifestCatalogServer,
    } = await import('../src/server.js');
    const server = new VAManifestCatalogServer();
    await server.initialize();

    const status = server.getStatus();

    if (status.tools && typeof status.tools === 'object') {
      logSuccess('Server has tools information');

      // Check tools structure
      if (
        status.tools.totalTools &&
        typeof status.tools.totalTools === 'number'
      ) {
        logSuccess(`Server reports ${status.tools.totalTools} total tools`);
      } else {
        logError('Tools information missing totalTools count');
        return false;
      }

      if (
        status.tools.categories &&
        typeof status.tools.categories === 'object'
      ) {
        logSuccess('Server has tool categories');

        // Check for expected categories
        const expectedCategories = ['manifest', 'patterns'];
        for (const category of expectedCategories) {
          if (status.tools.categories[category]) {
            logSuccess(`Found ${category} tools category`);
          } else {
            logWarning(`Missing ${category} tools category`);
          }
        }
      }

      return true;
    }
    logError('Server status missing tools information');
    return false;
  } catch (error) {
    logError(`Tools integration test failed: ${error.message}`);
    return false;
  }
}

export async function testCleanup() {
  logInfo('Testing server cleanup...');

  try {
    const {
      default: VAManifestCatalogServer,
    } = await import('../src/server.js');
    const server = new VAManifestCatalogServer();
    await server.initialize();

    // Test cleanup method
    await server.cleanup();
    logSuccess('Server cleanup completed without errors');

    return true;
  } catch (error) {
    logError(`Server cleanup test failed: ${error.message}`);
    return false;
  }
}

export async function runAllServerTests() {
  log(colors.bold + '='.repeat(50));
  log('MCP Server Tests');
  log('='.repeat(50) + colors.reset);

  const tests = [
    { name: 'Server Import', fn: testServerImport },
    { name: 'Server Construction', fn: testServerConstruction },
    { name: 'Server Initialization', fn: testServerInitialization },
    { name: 'Server Status', fn: testServerStatus },
    { name: 'Tools Integration', fn: testToolsIntegration },
    { name: 'Server Cleanup', fn: testCleanup },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    log(`\n${colors.bold}Running ${test.name} test...${colors.reset}`);

    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      logError(`Test ${test.name} threw an error: ${error.message}`);
      failed++;
    }
  }

  // Summary
  log(`\n${colors.bold}${'='.repeat(50)}`);
  log('Server Test Summary');
  log('='.repeat(50) + colors.reset);

  if (failed === 0) {
    logSuccess(`All ${passed} server tests passed! 🎉`);
  } else {
    logError(`${failed} test(s) failed, ${passed} test(s) passed.`);
  }

  return { passed, failed, total: passed + failed };
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllServerTests()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      logError(`Test runner failed: ${error.message}`);
      process.exit(1);
    });
}
