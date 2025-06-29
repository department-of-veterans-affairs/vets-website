#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop, no-plusplus */

/**
 * Test Runner Script
 * Runs all test suites in sequence with colored output
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function runTest(testFile, testName) {
  return new Promise(resolve => {
    process.stderr.write(`${colorize(`\n🧪 Running ${testName}...`, 'cyan')}\n`);
    process.stderr.write(`${colorize('='.repeat(60), 'blue')}\n`);

    const testPath = join(__dirname, 'tests', testFile);
    const child = spawn('node', [testPath], {
      stdio: 'inherit',
      cwd: __dirname,
    });

    child.on('close', code => {
      if (code === 0) {
        process.stderr.write(
          `${colorize(`✅ ${testName} passed!`, 'green')}\n`,
        );
      } else {
        process.stderr.write(
          `${colorize(
            `❌ ${testName} failed with exit code ${code}`,
            'red',
          )}\n`,
        );
      }
      resolve(code === 0);
    });

    child.on('error', error => {
      process.stderr.write(
        `${colorize(
          `❌ Error running ${testName}: ${error.message}`,
          'red',
        )}\n`,
      );
      resolve(false);
    });
  });
}

async function runAllTests() {
  process.stderr.write(
    `${colorize(
      '🚀 VA.gov Manifest Catalog MCP Server - Test Suite',
      'bright',
    )}\n`,
  );
  process.stderr.write(`${colorize('='.repeat(60), 'blue')}\n`);

  const tests = [
    { file: 'compatibility.test.js', name: 'Compatibility Tests' },
    { file: 'imports.test.js', name: 'Import Tests' },
    { file: 'server.test.js', name: 'Server Tests' },
  ];

  const results = [];
  let totalTests = 0;
  let passedTests = 0;

  for (const test of tests) {
    const passed = await runTest(test.file, test.name);
    results.push({ name: test.name, passed });
    totalTests += 1;
    if (passed) passedTests += 1;
  }

  // Summary
  process.stderr.write(`${colorize('\n📊 Test Summary', 'bright')}\n`);
  process.stderr.write(`${colorize('='.repeat(60), 'blue')}\n`);

  results.forEach(result => {
    const status = result.passed
      ? colorize('✅ PASSED', 'green')
      : colorize('❌ FAILED', 'red');
    process.stderr.write(`${result.name}: ${status}\n`);
  });

  process.stderr.write(`${colorize('\n📈 Overall Results:', 'bright')}\n`);
  process.stderr.write(`Total Tests: ${totalTests}\n`);
  process.stderr.write(`Passed: ${colorize(passedTests, 'green')}\n`);
  process.stderr.write(
    `Failed: ${colorize(
      totalTests - passedTests,
      passedTests === totalTests ? 'green' : 'red',
    )}\n`,
  );

  if (passedTests === totalTests) {
    process.stderr.write(
      `${colorize(
        '\n🎉 All tests passed! Your MCP server is ready to go!',
        'green',
      )}\n`,
    );
    process.exit(0);
  } else {
    process.stderr.write(
      `${colorize(
        '\n⚠️  Some tests failed. Please check the output above.',
        'yellow',
      )}\n`,
    );
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  process.stderr.write(
    `${colorize(
      'VA.gov Manifest Catalog MCP Server - Test Runner',
      'bright',
    )}\n`,
  );
  process.stderr.write('\nUsage:\n');
  process.stderr.write('  node run-tests.js        Run all tests\n');
  process.stderr.write('  npm run test:all          Run all tests (via npm)\n');
  process.stderr.write(
    '  npm run test:compatibility Run compatibility tests only\n',
  );
  process.stderr.write('  npm run test:imports      Run import tests only\n');
  process.stderr.write('  npm run test:server       Run server tests only\n');
  process.stderr.write('\nOptions:\n');
  process.stderr.write('  --help, -h               Show this help message\n');
  process.exit(0);
}

// Run all tests
runAllTests().catch(error => {
  process.stderr.write(`${colorize(`Fatal error: ${error.message}`, 'red')}\n`);
  process.exit(1);
});
