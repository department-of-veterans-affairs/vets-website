/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const glob = require('glob');
// const fs = require('fs');
// const path = require('path');
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
// log this out to determing if we still need this

// Helper function to get test paths
function getTestPaths() {
  if (options['full-suite']) {
    return glob.sync(DEFAULT_SPEC_PATTERN);
  }

  const changedFiles = (process.env.CHANGED_FILES || '')
    .split(' ')
    .map(
      file => file.trim()
    )
    .filter(Boolean)
    .map(
      file => 
        file.replace(/^\.\//, '')
      .replace(/\\/g, '/')
    )
    .filter(
      file =>
        !file.endsWith('.md') && 
        !file.startsWith('.github/workflows')
    );

  if (changedFiles.length > 0) {
    const appTests = changedFiles
      .filter(file => file.startsWith('src/applications/'))
      .map(file => {
        const appName = file.split('/')[2];
        return `src/applications/${appName}/**/*.unit.spec.js?(x)`;
      })
      .flatMap(pattern => glob.sync(pattern));

    const platformTests = changedFiles
      .filter(file => file.startsWith('src/platform/'))
      .map(
        file => file.split('/')
        .slice(0, 3)
        .join('/'),
      )
      .flatMap(
        base => glob.sync(`${base}/**/*.unit.spec.js?(x)`)
      );

    const staticPagesTests = glob.sync(STATIC_PAGES_PATTERN);

    return [...new Set([...appTests, ...platformTests, ...staticPagesTests])];
  }

  const cliPatterns = Array.isArray(options.path) ? options.path : [options.path];
  const expanded = cliPatterns.flatMap(pattern => glob.sync(pattern));
  return [...new Set(expanded)];
}

// Helper function to build test command
function buildTestCommand(testPaths) {
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

  return `STEP=unit-tests LOG_LEVEL=${options[
    'log-level'
  ].toLowerCase()} ${testRunner} --max-old-space-size=${MAX_MEMORY} --config ${
    options.config
  } ${testPaths.join(' ')}`;
}

// Main execution
async function main() {
  try {
    const testPaths = getTestPaths();

    if (testPaths.length === 0) {
      console.log('No tests to run');
      core.exportVariable('tests_ran', 'false');
      return;
    }

    const command = buildTestCommand(testPaths);
    await runCommand(command);
    core.exportVariable('tests_ran', 'true');
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

main();
