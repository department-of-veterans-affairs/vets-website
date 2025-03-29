/* eslint-disable no-console */
/**
 * @fileoverview Script to run unit tests with memory management reporter
 * Runs with user specified garbage collection settings,
 * custom reporting comes from the MemoryReporter
 *
 * @usage
 * - Default - GC only at start/end of run
 * > `node script/run-unit-tests-memory.js --reporter-options`
 *
 * - Most accurate but slowest - GC after every test
 * > `node script/run-unit-tests-memory.js --reporter-options gcFrequency=test`
 *
 * - Balanced-ish - GC only at suite boundaries
 * > `node script/run-unit-tests-memory.js --reporter-options gcFrequency=suite`
 *
 * - Custom test sampling rate - GC only on some tests (every 10th test)
 * > `node script/run-unit-tests-memory.js --reporter-options gcFrequency=test,sampleRate=10`
 *
 *  - No GC - global.gc not called even if available in environment, same as default if global.gc is not available
 * > `node script/run-unit-tests-memory.js --reporter-options gcFrequency=never`
 *
 */

const path = require('path');
const commandLineArgs = require('command-line-args');
const { spawnSync } = require('child_process');

/**
 * @typedef {Object} TestRunnerOptions
 * @property {string[]} path - Test file patterns to execute
 * @property {string} logLevel - Logging level
 * @property {string|null} app - Specific application to test
 * @property {string} reporterOptions - Custom options for the test reporter
 *
 */

/**
 * @type {Array<import('command-line-args').OptionDefinition>}
 */
const optionDefinitions = [
  {
    name: 'path',
    type: String,
    defaultOption: true,
    multiple: true,
    defaultValue: ['src/**/*.unit.spec.js'],
  },
  {
    name: 'log-level',
    type: String,
    defaultValue: 'log',
  },
  {
    name: 'app',
    type: String,
    defaultValue: null,
  },
  {
    name: 'reporter-options',
    type: String,
    defaultValue: '',
  },
];

/**
 * Configures the test execution paths based on provided options
 * @param {TestRunnerOptions} options - Parsed command line options
 * @returns {TestRunnerOptions} Updated options with configured paths
 */
function configureTestPaths(options) {
  if (options.app) {
    return {
      ...options,
      path: [`src/applications/${options.app}/tests/**/*.unit.spec.js`],
    };
  }
  return options;
}

/**
 * Resolves paths to mocha memory reporter and mocha binary
 * @returns {Object} Object containing resolved paths
 */
function resolveRequiredPaths() {
  return {
    reporter: path.resolve(__dirname, './run-unit-tests-memory-reporter.js'),
    mocha: path.resolve(__dirname, '../node_modules/.bin/mocha'),
  };
}

/**
 * Builds the execution arguments as array
 * this way we can pass it to spawnSync as a single argument
 * @param {TestRunnerOptions} options - Configured test options
 * @param {Object} paths - Resolved paths for executables
 * @returns {string[]} node args
 */
function buildNodeArgs(options, paths) {
  return [
    '--expose-gc',
    '--max-old-space-size=4096',
    paths.mocha,
    '--reporter',
    paths.reporter,
    '--reporter-options',
    options['reporter-options'],
    '--config',
    'config/mocha.json',
    '--recursive',
    ...options.path,
  ];
}

/**
 * Creates the node env object for test execution
 * this is used to set the environment variables for spawnSync
 * @param {TestRunnerOptions} options - Configured test options
 * @returns {NodeJS.ProcessEnv} env vars
 */
function createTestEnvironment(options) {
  return {
    ...process.env,
    BABEL_ENV: 'test',
    NODE_ENV: 'test',
    LOG_LEVEL: options['log-level'].toLowerCase(),
  };
}

/**
 * Run the tests
 * @returns {void}
 */
function main() {
  try {
    const options = configureTestPaths(commandLineArgs(optionDefinitions));
    const paths = resolveRequiredPaths();
    const nodeArgs = buildNodeArgs(options, paths);
    const env = createTestEnvironment(options);

    const result = spawnSync('node', nodeArgs, {
      stdio: 'inherit',
      env,
      cwd: process.cwd(),
    });

    process.exit(result.status);
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

// Only run main() if this file is being executed directly
// this way we could import this file and use MemoryReporter in other files too
if (require.main === module) {
  main();
}

// we could use this to run tests in other scripts/node apps?
// TODO: test this type of idea
module.exports = {
  main,
};
