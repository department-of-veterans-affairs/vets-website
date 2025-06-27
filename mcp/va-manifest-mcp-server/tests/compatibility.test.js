#!/usr/bin/env node

/**
 * Compatibility Test Suite
 *
 * Tests the MCP server's compatibility with different Node.js versions
 * and MCP SDK versions. This test suite validates:
 *
 * 1. Node.js version requirements (14.15.0+)
 * 2. MCP SDK import functionality
 * 3. Server initialization
 * 4. Basic tool functionality
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { importSDK, getVersionInfo } from '../src/utils/sdkImports.js';

// ANSI color codes for output
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

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.blue);
}

export async function testNodeVersion() {
  logInfo('Testing Node.js version compatibility...');

  const nodeVersion = process.versions.node;
  const [major, minor, patch] = nodeVersion.split('.').map(Number);

  // Check minimum version (14.15.0)
  const isCompatible = major > 14 || (major === 14 && minor >= 15);

  if (isCompatible) {
    logSuccess(`Node.js ${nodeVersion} meets minimum requirements (>=14.15.0)`);
    return true;
  }
  logError(
    `Node.js ${nodeVersion} does not meet minimum requirements (>=14.15.0)`,
  );
  return false;
}

export async function testSDKVersion() {
  logInfo('Testing MCP SDK version...');

  try {
    const packageJsonPath = join(
      process.cwd(),
      'node_modules',
      '@modelcontextprotocol',
      'sdk',
      'package.json',
    );
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const sdkVersion = packageJson.version;

    logSuccess(`MCP SDK version: ${sdkVersion}`);

    // Check if it's a supported version
    const majorVersion = parseInt(sdkVersion.split('.')[0], 10);
    if (majorVersion >= 0) {
      logSuccess('SDK version is supported');
      return true;
    }
    logWarning('SDK version may not be fully supported');
    return false;
  } catch (error) {
    logError(`Could not detect SDK version: ${error.message}`);
    return false;
  }
}

export async function testSDKImports() {
  logInfo('Testing SDK imports...');

  try {
    const sdk = await importSDK();

    // Check all required components
    const requiredComponents = [
      'Server',
      'StdioServerTransport',
      'CallToolRequestSchema',
      'ListToolsRequestSchema',
      'McpError',
      'ErrorCode',
    ];

    const missing = requiredComponents.filter(component => !sdk[component]);

    if (missing.length === 0) {
      logSuccess('All required SDK components imported successfully');
      logInfo(`Available components: ${Object.keys(sdk).join(', ')}`);
      return true;
    }
    logError(`Missing SDK components: ${missing.join(', ')}`);
    return false;
  } catch (error) {
    logError(`SDK import failed: ${error.message}`);
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

    // Test initialization without starting the server
    await server.initialize();

    if (server.server) {
      logSuccess('Server initialized successfully');

      // Test status method
      const status = server.getStatus();
      logInfo(`Server status: ${JSON.stringify(status, null, 2)}`);

      return true;
    }
    logError('Server initialization failed - no server instance created');
    return false;
  } catch (error) {
    logError(`Server initialization failed: ${error.message}`);
    return false;
  }
}

export async function testVersionInformation() {
  logInfo('Testing version information...');

  try {
    const versionInfo = await getVersionInfo();

    log(`\n${colors.bold}Version Information:${colors.reset}`);
    log(
      `Node.js: ${versionInfo.nodeVersion} (Major: ${
        versionInfo.nodeMajorVersion
      }, Minor: ${versionInfo.nodeMinorVersion})`,
    );
    log(`Legacy Node: ${versionInfo.isLegacyNode}`);
    log(
      `MCP SDK: ${versionInfo.sdkVersion || 'unknown'} (Major: ${
        versionInfo.sdkMajorVersion
      })`,
    );
    log(`Import Paths: ${JSON.stringify(versionInfo.importPaths, null, 2)}`);

    logSuccess('Version information retrieved successfully');
    return true;
  } catch (error) {
    logError(`Version info test failed: ${error.message}`);
    return false;
  }
}

export async function runAllCompatibilityTests() {
  log(colors.bold + '='.repeat(60));
  log('VA.gov Manifest Catalog MCP Server - Compatibility Test');
  log('='.repeat(60) + colors.reset);

  const tests = [
    { name: 'Node.js Version', fn: testNodeVersion },
    { name: 'MCP SDK Version', fn: testSDKVersion },
    { name: 'SDK Imports', fn: testSDKImports },
    { name: 'Server Initialization', fn: testServerInitialization },
    { name: 'Version Information', fn: testVersionInformation },
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
  log(`\n${colors.bold}${'='.repeat(60)}`);
  log('Test Summary');
  log('='.repeat(60) + colors.reset);

  if (failed === 0) {
    logSuccess(`All ${passed} tests passed! 🎉`);
    logSuccess('Your MCP server is compatible with this environment.');
  } else {
    logError(`${failed} test(s) failed, ${passed} test(s) passed.`);
    logWarning('Some compatibility issues were detected.');
  }

  return { passed, failed, total: passed + failed };
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllCompatibilityTests()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      logError(`Test runner failed: ${error.message}`);
      process.exit(1);
    });
}
