#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop, no-return-await */

/**
 * Test Suite Runner
 *
 * Main entry point for running all tests in the test suite.
 * Can run individual test suites or all tests together.
 */

import { runAllCompatibilityTests } from './compatibility.test.js';
import { runAllImportTests } from './imports.test.js';
import { runAllServerTests } from './server.test.js';

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

export async function runAllTests() {
  log(colors.bold + '='.repeat(70));
  log('VA.gov Manifest Catalog MCP Server - Complete Test Suite');
  log('='.repeat(70) + colors.reset);

  const testSuites = [
    { name: 'Compatibility Tests', fn: runAllCompatibilityTests },
    { name: 'Import Tests', fn: runAllImportTests },
    { name: 'Server Tests', fn: runAllServerTests },
  ];

  const results = {};
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;

  for (const suite of testSuites) {
    log(`\n${colors.bold}Running ${suite.name}...${colors.reset}`);

    try {
      const result = await suite.fn();
      results[suite.name] = result;
      totalPassed += result.passed;
      totalFailed += result.failed;
      totalTests += result.total;

      if (result.failed === 0) {
        logSuccess(`${suite.name}: All ${result.passed} tests passed`);
      } else {
        logError(
          `${suite.name}: ${result.failed} failed, ${result.passed} passed`,
        );
      }
    } catch (error) {
      logError(`${suite.name} failed to run: ${error.message}`);
      results[suite.name] = { passed: 0, failed: 1, total: 1 };
      totalFailed += 1;
      totalTests += 1;
    }
  }

  // Overall summary
  log(`\n${colors.bold}${'='.repeat(70)}`);
  log('Overall Test Summary');
  log('='.repeat(70) + colors.reset);

  log(`Total tests run: ${totalTests}`);
  log(`Passed: ${colors.green}${totalPassed}${colors.reset}`);
  log(`Failed: ${colors.red}${totalFailed}${colors.reset}`);

  if (totalFailed === 0) {
    logSuccess(
      `🎉 All ${totalTests} tests passed! Your MCP server is working correctly.`,
    );
  } else {
    logError(
      `⚠️  ${totalFailed} test(s) failed out of ${totalTests} total tests.`,
    );
    logWarning('Please review the failed tests above for more details.');
  }

  // Detailed results
  log(`\n${colors.bold}Detailed Results:${colors.reset}`);
  Object.entries(results).forEach(([suiteName, result]) => {
    const status =
      result.failed === 0 ? `${colors.green}PASS` : `${colors.red}FAIL`;
    log(
      `  ${suiteName}: ${status}${colors.reset} (${result.passed}/${
        result.total
      })`,
    );
  });

  return {
    passed: totalPassed,
    failed: totalFailed,
    total: totalTests,
    suites: results,
  };
}

export async function runSpecificTest(testName) {
  const testMap = {
    compatibility: runAllCompatibilityTests,
    imports: runAllImportTests,
    server: runAllServerTests,
  };

  const testFn = testMap[testName.toLowerCase()];

  if (!testFn) {
    logError(`Unknown test suite: ${testName}`);
    logInfo('Available test suites: compatibility, imports, server');
    return null;
  }

  logInfo(`Running ${testName} tests only...`);
  return await testFn();
}

function showUsage() {
  log(`\n${colors.bold}Test Suite Runner${colors.reset}`);
  log('Usage: node tests/index.js [test-suite]');
  log('');
  log('Test Suites:');
  log('  compatibility  - Node.js and SDK compatibility tests');
  log('  imports        - SDK import functionality tests');
  log('  server         - Server initialization and functionality tests');
  log('  all            - Run all test suites (default)');
  log('');
  log('Examples:');
  log('  node tests/index.js');
  log('  node tests/index.js all');
  log('  node tests/index.js compatibility');
  log('  node tests/index.js imports');
  log('  node tests/index.js server');
}

// Main execution
const testArg = process.argv[2];

if (testArg === 'help' || testArg === '--help' || testArg === '-h') {
  showUsage();
  process.exit(0);
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  let testPromise;

  if (!testArg || testArg === 'all') {
    testPromise = runAllTests();
  } else {
    testPromise = runSpecificTest(testArg);
  }

  testPromise
    .then(results => {
      if (results && results.failed > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch(error => {
      logError(`Test execution failed: ${error.message}`);
      process.exit(1);
    });
}
