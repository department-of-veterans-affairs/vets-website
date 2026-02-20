/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const { runCommand } = require('../utils');
// For usage instructions see https://github.com/department-of-veterans-affairs/vets-website#unit-tests

// Configuration
const DEFAULT_SPEC_PATTERN = '{src,script}/**/*.unit.spec.js?(x)';
const STATIC_PAGES_PATTERN = 'src/platform/site-wide/**/*.unit.spec.js?(x)';
const MAX_MEMORY = '8192'; // Reduced from 32768 to prevent memory issues

// Command line options
const COMMAND_LINE_OPTIONS = [
  { name: 'log-level', type: String, defaultValue: 'log' },
  { name: 'app-folder', type: String, defaultValue: null },
  { name: 'coverage', type: Boolean, defaultValue: false },
  { name: 'coverage-html', type: Boolean, defaultValue: false },
  { name: 'reporter', type: String, defaultValue: null },
  { name: 'help', alias: 'h', type: Boolean, defaultValue: false },
  { name: 'config', type: String, defaultValue: 'config/mocha.json' },
  { name: 'full-suite', type: Boolean, defaultValue: false },
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

// Helper function to check if a custom path pattern was provided
function hasCustomPathPattern() {
  // Check if the path was explicitly provided (not the default)
  return (
    options.path &&
    options.path.length > 0 &&
    !(options.path.length === 1 && options.path[0] === DEFAULT_SPEC_PATTERN)
  );
}

// Helper function to get test patterns (returns glob patterns, not expanded file paths)
// This avoids E2BIG errors when there are too many test files
function getTestPatterns() {
  // If a custom path pattern was provided, use it directly
  if (hasCustomPathPattern()) {
    return options.path;
  }

  // If app-folder is specified, use it to generate the pattern
  if (options['app-folder']) {
    return [`src/applications/${options['app-folder']}/**/*.unit.spec.js?(x)`];
  }

  if (options['full-suite']) {
    return [DEFAULT_SPEC_PATTERN];
  }

  const changedFiles = process.env.CHANGED_FILES
    ? process.env.CHANGED_FILES.split(' ').filter(
        file => !file.endsWith('.md') && !file.startsWith('.github/workflows'),
      )
    : [];

  if (changedFiles.length === 0) {
    return [STATIC_PAGES_PATTERN];
  }

  // May need to convert this output into an array?
  if (process.env.NODE_COMPATBILITY_VERIFICATION) {
    return JSON.parse(fs.readFileSync(path.resolve(`changed_unit_tests.json`)));
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

  // If any config/form.js files changed, include the forms config validator
  if (changedFiles.some(file => /config\/form\.js.?$/.test(file))) {
    patterns.push(
      'src/platform/forms/tests/forms-config-validator.unit.spec.jsx',
    );
  }

  // Remove duplicates (static pages may already be in platform patterns)
  return [...new Set(patterns)];
}

// Helper function to check if any tests match the patterns
function hasMatchingTests(patterns) {
  for (const pattern of patterns) {
    const matches = glob.sync(pattern);
    if (matches.length > 0) {
      return true;
    }
  }
  return false;
}

// Helper function to build test command
// Takes glob patterns (not expanded file paths) to avoid E2BIG errors
function buildTestCommand(testPatterns) {
  const coverageInclude = options['app-folder']
    ? `--include 'src/applications/${options['app-folder']}/**'`
    : '';

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

  return `STEP=unit-tests LOG_LEVEL=${options[
    'log-level'
  ].toLowerCase()} ${testRunner} --max-old-space-size=${MAX_MEMORY} --config ${
    options.config
  } ${quotedPatterns}`;
}

// Helper function to describe which pattern source is being used
function getPatternSource() {
  if (hasCustomPathPattern()) {
    return options.path.join(', ');
  }
  if (options['app-folder']) {
    return `src/applications/${options['app-folder']}/**/*.unit.spec.js?(x)`;
  }
  return 'auto-detected';
}

// Main execution
async function main() {
  try {
    const testPatterns = getTestPatterns();

    if (!hasMatchingTests(testPatterns)) {
      console.log('No tests to run');
      core.exportVariable('tests_ran', 'false');
      return;
    }

    console.log(`Running tests matching patterns: ${getPatternSource()}`);
    const command = buildTestCommand(testPatterns);
    await runCommand(command);
    core.exportVariable('tests_ran', 'true');
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

main();
