#!/usr/bin/env node
/* eslint-disable no-console, no-unused-vars */

/**
 * MCP SDK Version Upgrade Helper
 *
 * This script helps upgrade and test different versions of the MCP SDK
 * while ensuring compatibility with Node.js 14.15.0+
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

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

function getCurrentSDKVersion() {
  try {
    const packageJsonPath = join(
      process.cwd(),
      'node_modules',
      '@modelcontextprotocol',
      'sdk',
      'package.json',
    );
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    return null;
  }
}

function getAvailableVersions() {
  try {
    const output = execSync(
      'npm view @modelcontextprotocol/sdk versions --json',
      { encoding: 'utf8' },
    );
    return JSON.parse(output);
  } catch (error) {
    logError(`Failed to fetch available versions: ${error.message}`);
    return [];
  }
}

function installSDKVersion(version) {
  try {
    logInfo(`Installing MCP SDK version ${version}...`);
    execSync(`npm install @modelcontextprotocol/sdk@${version}`, {
      stdio: 'inherit',
    });
    logSuccess(`Successfully installed MCP SDK ${version}`);
    return true;
  } catch (error) {
    logError(`Failed to install MCP SDK ${version}: ${error.message}`);
    return false;
  }
}

function runCompatibilityTest() {
  try {
    logInfo('Running compatibility test...');
    execSync('node tests/compatibility.test.js', { stdio: 'inherit' });
    return true;
  } catch (error) {
    logError('Compatibility test failed');
    return false;
  }
}

function testSDKVersion(version) {
  log(`\n${colors.bold}Testing MCP SDK version ${version}${colors.reset}`);
  log('='.repeat(50));

  const currentVersion = getCurrentSDKVersion();
  if (currentVersion === version) {
    logInfo(`Version ${version} is already installed`);
  } else if (!installSDKVersion(version)) {
    return false;
  }

  const testPassed = runCompatibilityTest();

  if (testPassed) {
    logSuccess(`MCP SDK ${version} is compatible!`);
  } else {
    logError(`MCP SDK ${version} has compatibility issues`);
  }

  return testPassed;
}

function showVersionInfo() {
  const currentVersion = getCurrentSDKVersion();
  const availableVersions = getAvailableVersions();

  log(`\n${colors.bold}MCP SDK Version Information${colors.reset}`);
  log('='.repeat(40));

  if (currentVersion) {
    log(`Current version: ${colors.green}${currentVersion}${colors.reset}`);
  } else {
    log(`Current version: ${colors.red}Not installed${colors.reset}`);
  }

  if (availableVersions.length > 0) {
    const latest = availableVersions[availableVersions.length - 1];
    log(`Latest version: ${colors.blue}${latest}${colors.reset}`);

    const recentVersions = availableVersions.slice(-5);
    log(`Recent versions: ${recentVersions.join(', ')}`);
  }
}

function upgradeToLatest() {
  log(`\n${colors.bold}Upgrading to latest MCP SDK version${colors.reset}`);
  log('='.repeat(50));

  const availableVersions = getAvailableVersions();
  if (availableVersions.length === 0) {
    logError('Could not fetch available versions');
    return false;
  }

  const latest = availableVersions[availableVersions.length - 1];
  const currentVersion = getCurrentSDKVersion();

  if (currentVersion === latest) {
    logSuccess(`Already using the latest version (${latest})`);
    return true;
  }

  return testSDKVersion(latest);
}

function testMultipleVersions() {
  log(`\n${colors.bold}Testing Multiple MCP SDK Versions${colors.reset}`);
  log('='.repeat(50));

  const availableVersions = getAvailableVersions();
  if (availableVersions.length === 0) {
    logError('Could not fetch available versions');
    return;
  }

  // Test a selection of versions
  const versionsToTest = [
    '0.5.0', // Current minimum
    '1.0.0', // Major version 1
    availableVersions[availableVersions.length - 1], // Latest
  ].filter(v => availableVersions.includes(v));

  const results = {};

  for (let i = 0; i < versionsToTest.length; i += 1) {
    const version = versionsToTest[i];
    results[version] = testSDKVersion(version);
  }

  // Summary
  log(`\n${colors.bold}Test Results Summary${colors.reset}`);
  log('='.repeat(30));

  Object.entries(results).forEach(([version, passed]) => {
    const status = passed
      ? `${colors.green}✓ Compatible`
      : `${colors.red}✗ Issues`;
    log(`${version}: ${status}${colors.reset}`);
  });
}

function showUsage() {
  log(`\n${colors.bold}MCP SDK Upgrade Helper${colors.reset}`);
  log('Usage: node tests/upgrade-sdk.js [command]');
  log('');
  log('Commands:');
  log('  info        Show current and available version information');
  log('  latest      Upgrade to the latest version and test');
  log('  test        Test multiple SDK versions for compatibility');
  log('  version <v> Install and test a specific version');
  log('  help        Show this help message');
  log('');
  log('Examples:');
  log('  node tests/upgrade-sdk.js info');
  log('  node tests/upgrade-sdk.js latest');
  log('  node tests/upgrade-sdk.js version 1.13.1');
  log('  node tests/upgrade-sdk.js test');
  log('');
  log('Or use npm scripts:');
  log('  npm run upgrade-sdk');
  log('  npm run upgrade-sdk:info');
  log('  npm run upgrade-sdk:test');
}

// Main execution
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'info':
    showVersionInfo();
    break;

  case 'latest':
    upgradeToLatest();
    break;

  case 'test':
    testMultipleVersions();
    break;

  case 'version':
    if (!arg) {
      logError('Please specify a version number');
      logInfo('Example: node tests/upgrade-sdk.js version 1.13.1');
      process.exit(1);
    }
    testSDKVersion(arg);
    break;

  case 'help':
  case '--help':
  case '-h':
    showUsage();
    break;

  default:
    if (command) {
      logError(`Unknown command: ${command}`);
    }
    showUsage();
    process.exit(1);
}
