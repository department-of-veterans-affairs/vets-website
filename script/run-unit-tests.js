/* eslint-disable no-console */
/**
 * Unified unit test runner for vets-website
 *
 * This script works in both local development and GitHub Actions environments.
 * It auto-detects the environment and adjusts behavior accordingly.
 *
 * For usage instructions see https://github.com/department-of-veterans-affairs/vets-website#unit-tests
 */

const commandLineArgs = require('command-line-args');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const printUnitTestHelp = require('./run-unit-test-help');
const { runCommand } = require('./utils');

// Environment detection
const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS);

// Try to load @actions/core only in GitHub Actions
let core = null;
if (isGitHubActions) {
  try {
    core = require('@actions/core');
  } catch {
    // @actions/core not available, that's fine for local development
  }
}

// Configuration
const SPEC_DIRS = '{src,script}';
const DEFAULT_SPEC_PATTERN = `${SPEC_DIRS}/**/*.unit.spec.js?(x)`;
const STATIC_PAGES_PATTERN = 'src/platform/site-wide/**/*.unit.spec.js?(x)';
const MAX_MEMORY_GHA = '8192';
const MAX_MEMORY_LOCAL = '4096';

// Command line options (unified from both scripts)
const COMMAND_LINE_OPTIONS = [
  { name: 'log-level', type: String, defaultValue: 'log' },
  { name: 'app-folder', type: String, defaultValue: null },
  { name: 'coverage', type: Boolean, defaultValue: false },
  { name: 'coverage-html', type: Boolean, defaultValue: false },
  { name: 'reporter', type: String, defaultValue: null },
  { name: 'help', alias: 'h', type: Boolean, defaultValue: false },
  { name: 'config', type: String, defaultValue: 'config/mocha.json' },
  // GHA-specific options (can be used locally too)
  { name: 'full-suite', type: Boolean, defaultValue: false },
  { name: 'changed-only', type: Boolean, defaultValue: false },
  { name: 'per-directory', type: Boolean, defaultValue: false },
  {
    name: 'path',
    type: String,
    defaultOption: true,
    multiple: true,
    defaultValue: [DEFAULT_SPEC_PATTERN],
  },
];

// Get command line options
const options = commandLineArgs(COMMAND_LINE_OPTIONS);

/**
 * Export a variable to GitHub Actions if running in that environment
 * @param {string} name - Variable name
 * @param {string} value - Variable value
 */
function exportVariable(name, value) {
  if (core) {
    core.exportVariable(name, value);
  }
}

/**
 * Check if a custom path pattern was provided (not the default)
 * @returns {boolean}
 */
function hasCustomPathPattern() {
  return (
    options.path &&
    options.path.length > 0 &&
    !(options.path.length === 1 && options.path[0] === DEFAULT_SPEC_PATTERN)
  );
}

/**
 * Get test patterns based on changed files (GHA mode)
 * @returns {string[]} Array of glob patterns
 */
function getChangedTestPatterns() {
  const changedFiles = process.env.CHANGED_FILES
    ? process.env.CHANGED_FILES.split(' ').filter(
        file => !file.endsWith('.md') && !file.startsWith('.github/workflows'),
      )
    : [];

  if (changedFiles.length === 0) {
    return [STATIC_PAGES_PATTERN];
  }

  // For node compatibility verification, read from file
  if (process.env.NODE_COMPATIBILITY_VERIFICATION) {
    try {
      return JSON.parse(
        fs.readFileSync(path.resolve('changed_unit_tests.json')),
      );
    } catch {
      console.warn('Could not read changed_unit_tests.json, using fallback');
      return [STATIC_PAGES_PATTERN];
    }
  }

  // Get unique app-specific test patterns
  const appPatterns = [
    ...new Set(
      changedFiles
        .filter(file => file.startsWith('src/applications/'))
        .map(file => {
          const appName = file.split('/')[2];
          return `src/applications/${appName}/**/*.unit.spec.js?(x)`;
        }),
    ),
  ];

  // Get unique platform test patterns
  const platformPatterns = [
    ...new Set(
      changedFiles
        .filter(file => file.startsWith('src/platform/'))
        .map(file => {
          const platformPath = file
            .split('/')
            .slice(0, 3)
            .join('/');
          return `${platformPath}/**/*.unit.spec.js?(x)`;
        }),
    ),
  ];

  // Always include static pages pattern
  const patterns = [...appPatterns, ...platformPatterns, STATIC_PAGES_PATTERN];

  // Remove duplicates
  return [...new Set(patterns)];
}

/**
 * Get test patterns based on options and environment
 * Returns glob patterns (not expanded file paths) to avoid E2BIG errors
 * @returns {string[]} Array of glob patterns
 */
function getTestPatterns() {
  // If a custom path pattern was provided, use it directly
  if (hasCustomPathPattern()) {
    return options.path;
  }

  // If app-folder is specified, use it to generate the pattern
  if (options['app-folder']) {
    return [`src/applications/${options['app-folder']}/**/*.unit.spec.js?(x)`];
  }

  // If running full suite (explicit flag or local default behavior)
  if (options['full-suite']) {
    return [DEFAULT_SPEC_PATTERN];
  }

  // Changed-only mode: detect which tests to run based on changed files
  // This is the default behavior in GitHub Actions
  if (options['changed-only'] || isGitHubActions) {
    return getChangedTestPatterns();
  }

  // Local default: run all tests
  return [DEFAULT_SPEC_PATTERN];
}

/**
 * Check if any tests match the given patterns
 * @param {string[]} patterns - Array of glob patterns
 * @returns {boolean}
 */
function hasMatchingTests(patterns) {
  for (const pattern of patterns) {
    const matches = glob.sync(pattern);
    if (matches.length > 0) {
      return true;
    }
  }
  return false;
}

/**
 * Get the coverage include pattern for nyc
 * @returns {string}
 */
function getCoverageInclude() {
  if (options['app-folder']) {
    return `--include 'src/applications/${options['app-folder']}/**'`;
  }
  return '';
}

/**
 * Build the test command
 * Takes glob patterns (not expanded file paths) to avoid E2BIG errors
 * @param {string[]} testPatterns - Array of glob patterns
 * @returns {string}
 */
function buildTestCommand(testPatterns) {
  const logLevel = options['log-level'].toLowerCase();
  const maxMemory = isGitHubActions ? MAX_MEMORY_GHA : MAX_MEMORY_LOCAL;
  const coverageInclude = getCoverageInclude();
  const reporterOption = options.reporter
    ? `--reporter ${options.reporter}`
    : '';

  const coverageReporter = options['coverage-html']
    ? '--reporter=html mocha --retries 5'
    : '--reporter=json-summary mocha --reporter mocha-multi-reporters --reporter-options configFile=config/mocha-multi-reporter.js --no-color --retries 5';

  const testRunner = options.coverage
    ? `NODE_ENV=test nyc --all ${coverageInclude} ${coverageReporter}`
    : `BABEL_ENV=test NODE_ENV=test mocha ${reporterOption}`;

  // Quote each pattern to prevent shell expansion issues and allow mocha to expand them
  const quotedPatterns = testPatterns.map(p => `'${p}'`).join(' ');

  return `STEP=unit-tests LOG_LEVEL=${logLevel} ${testRunner} --max-old-space-size=${maxMemory} --config ${
    options.config
  } ${quotedPatterns}`;
}

/**
 * Get a description of which pattern source is being used (for logging)
 * @returns {string}
 */
function getPatternSource() {
  if (hasCustomPathPattern()) {
    return `custom pattern: ${options.path.join(', ')}`;
  }
  if (options['app-folder']) {
    return `app folder: ${options['app-folder']}`;
  }
  if (options['changed-only'] || isGitHubActions) {
    return 'changed files (auto-detected)';
  }
  if (options['full-suite']) {
    return 'full suite';
  }
  return 'all tests';
}

/**
 * Get unique test directories from glob pattern
 * @param {string} pattern - Glob pattern
 * @returns {string[]} Array of unique directory patterns
 */
function getTestDirectories(pattern) {
  const allTests = glob.sync(pattern);
  const directories = new Set(
    allTests.map(spec => {
      const parts = path.dirname(spec).split('/');
      // Get first 3 parts after splitting (e.g., src/applications/app-name)
      return parts.slice(0, 3).join('/');
    }),
  );
  return Array.from(directories).filter(dir => dir !== undefined);
}

/**
 * Run a command and return a promise
 * @param {string} command - Command to execute
 * @returns {Promise<void>}
 */
function runCommandAsync(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    const child = spawn(command, [], { shell: true, stdio: 'inherit' });
    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });
    child.on('error', reject);
  });
}

/**
 * Run tests per directory (legacy local behavior)
 * @param {string[]} testPatterns - Array of glob patterns
 */
async function runTestsPerDirectory(testPatterns) {
  // Collect all unique directories from all patterns
  const allDirectories = new Set();
  for (const pattern of testPatterns) {
    const dirs = getTestDirectories(pattern);
    dirs.forEach(dir => allDirectories.add(dir));
  }

  const directories = Array.from(allDirectories);
  console.log(`Running tests in ${directories.length} directories...\n`);

  let hasFailures = false;
  for (const dir of directories) {
    const dirPattern = `${dir}/**/*.unit.spec.js?(x)`;
    if (hasMatchingTests([dirPattern])) {
      const command = buildTestCommand([dirPattern]);
      try {
        /* eslint-disable-next-line no-await-in-loop */
        await runCommandAsync(command);
      } catch (error) {
        console.error(`Tests failed in ${dir}:`, error.message);
        hasFailures = true;
        // Continue running other directories
      }
    }
  }

  if (hasFailures) {
    console.log('\nSome test directories had failures.');
  } else {
    console.log('\nAll tests complete.');
  }
}

/**
 * Main execution
 */
async function main() {
  // Show help if requested
  if (options.help) {
    printUnitTestHelp();
    process.exit(0);
  }

  try {
    const testPatterns = getTestPatterns();

    console.log(`Environment: ${isGitHubActions ? 'GitHub Actions' : 'Local'}`);
    console.log(`Pattern source: ${getPatternSource()}`);
    console.log(`Test patterns: ${testPatterns.join(', ')}`);
    if (options['per-directory']) {
      console.log('Mode: per-directory (separate mocha process per directory)');
    }

    if (!hasMatchingTests(testPatterns)) {
      console.log('No tests to run');
      exportVariable('tests_ran', 'false');
      return;
    }

    if (options['per-directory']) {
      await runTestsPerDirectory(testPatterns);
      exportVariable('tests_ran', 'true');
    } else {
      const command = buildTestCommand(testPatterns);
      console.log(`\nExecuting: ${command}\n`);
      // runCommand spawns a process and calls process.exit() on failure
      // It doesn't return a Promise, so no await needed
      // exportVariable is called before runCommand since runCommand may exit the process
      exportVariable('tests_ran', 'true');
      runCommand(command);
    }
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

main();
