#!/usr/bin/env node

/**
 * SDK Import Tests
 *
 * Focused tests for the dynamic import functionality across different
 * Node.js and MCP SDK versions.
 */

import { importSDK, getVersionInfo } from '../src/utils/sdkImports.js';

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
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.blue);
}

export async function testBasicImport() {
  logInfo('Testing basic SDK import...');

  try {
    const sdk = await importSDK();

    if (sdk && typeof sdk === 'object') {
      logSuccess('SDK import returned an object');
      return true;
    }
    logError('SDK import did not return a valid object');
    return false;
  } catch (error) {
    logError(`Basic import failed: ${error.message}`);
    return false;
  }
}

export async function testRequiredComponents() {
  logInfo('Testing required component availability...');

  try {
    const sdk = await importSDK();
    const requiredComponents = [
      'Server',
      'StdioServerTransport',
      'CallToolRequestSchema',
      'ListToolsRequestSchema',
      'McpError',
      'ErrorCode',
    ];

    const results = {};
    let allPresent = true;

    for (const component of requiredComponents) {
      const isPresent = !!sdk[component];
      results[component] = isPresent;

      if (isPresent) {
        logSuccess(`${component}: Available`);
      } else {
        logError(`${component}: Missing`);
        allPresent = false;
      }
    }

    return allPresent;
  } catch (error) {
    logError(`Component test failed: ${error.message}`);
    return false;
  }
}

export async function testComponentTypes() {
  logInfo('Testing component types...');

  try {
    const sdk = await importSDK();

    const typeTests = [
      { name: 'Server', expected: 'function' },
      { name: 'StdioServerTransport', expected: 'function' },
      { name: 'CallToolRequestSchema', expected: 'object' },
      { name: 'ListToolsRequestSchema', expected: 'object' },
      { name: 'McpError', expected: 'function' },
      { name: 'ErrorCode', expected: 'object' },
    ];

    let allCorrect = true;

    for (const test of typeTests) {
      const component = sdk[test.name];
      const actualType = typeof component;

      if (actualType === test.expected) {
        logSuccess(`${test.name}: Correct type (${actualType})`);
      } else {
        logError(
          `${test.name}: Wrong type (expected ${
            test.expected
          }, got ${actualType})`,
        );
        allCorrect = false;
      }
    }

    return allCorrect;
  } catch (error) {
    logError(`Type test failed: ${error.message}`);
    return false;
  }
}

export async function testVersionDetection() {
  logInfo('Testing version detection...');

  try {
    const versionInfo = await getVersionInfo();

    const requiredFields = [
      'nodeVersion',
      'nodeMajorVersion',
      'nodeMinorVersion',
      'isLegacyNode',
      'sdkVersion',
      'sdkMajorVersion',
      'importPaths',
    ];

    let allPresent = true;

    for (const field of requiredFields) {
      if (versionInfo.hasOwnProperty(field)) {
        logSuccess(`${field}: Present (${typeof versionInfo[field]})`);
      } else {
        logError(`${field}: Missing`);
        allPresent = false;
      }
    }

    // Test import paths structure
    if (
      versionInfo.importPaths &&
      typeof versionInfo.importPaths === 'object'
    ) {
      const pathFields = ['server', 'stdio', 'types'];
      for (const pathField of pathFields) {
        if (versionInfo.importPaths[pathField]) {
          logSuccess(
            `Import path ${pathField}: ${versionInfo.importPaths[pathField]}`,
          );
        } else {
          logError(`Import path ${pathField}: Missing`);
          allPresent = false;
        }
      }
    }

    return allPresent;
  } catch (error) {
    logError(`Version detection test failed: ${error.message}`);
    return false;
  }
}

export async function testMultipleImports() {
  logInfo('Testing multiple consecutive imports...');

  try {
    // Import multiple times to test caching/consistency
    const import1 = await importSDK();
    const import2 = await importSDK();
    const import3 = await importSDK();

    // Check that all imports succeed
    if (!import1 || !import2 || !import3) {
      logError('One or more imports failed');
      return false;
    }

    // Check that components are consistent
    const components = ['Server', 'StdioServerTransport', 'McpError'];
    for (const component of components) {
      if (
        import1[component] !== import2[component] ||
        import2[component] !== import3[component]
      ) {
        logError(`Component ${component} is not consistent across imports`);
        return false;
      }
    }

    logSuccess('Multiple imports are consistent');
    return true;
  } catch (error) {
    logError(`Multiple imports test failed: ${error.message}`);
    return false;
  }
}

export async function runAllImportTests() {
  log(colors.bold + '='.repeat(50));
  log('MCP SDK Import Tests');
  log('='.repeat(50) + colors.reset);

  const tests = [
    { name: 'Basic Import', fn: testBasicImport },
    { name: 'Required Components', fn: testRequiredComponents },
    { name: 'Component Types', fn: testComponentTypes },
    { name: 'Version Detection', fn: testVersionDetection },
    { name: 'Multiple Imports', fn: testMultipleImports },
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
  log('Import Test Summary');
  log('='.repeat(50) + colors.reset);

  if (failed === 0) {
    logSuccess(`All ${passed} import tests passed! 🎉`);
  } else {
    logError(`${failed} test(s) failed, ${passed} test(s) passed.`);
  }

  return { passed, failed, total: passed + failed };
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllImportTests()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      logError(`Test runner failed: ${error.message}`);
      process.exit(1);
    });
}
