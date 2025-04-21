/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const commandLineArgs = require('command-line-args');
const { runCommand } = require('../utils');

//
// 1) Define only the flags we actually need: coverage, log‑level, reporter, config,
//    and a catch‑all "path" for positional test file paths.
//
const optionDefinitions = [
  { name: 'log-level', type: String, defaultValue: 'verbose' },
  { name: 'coverage', type: Boolean, defaultValue: false },
  { name: 'coverage-html', type: Boolean, defaultValue: false },
  { name: 'reporter', type: String, defaultValue: null },
  { name: 'config', type: String, defaultValue: 'config/mocha.json' },
  {
    name: 'path',
    type: String,
    multiple: true,
    defaultOption: true,
    defaultValue: [],
  },
];

const options = commandLineArgs(optionDefinitions);

//
// 2) Figure out which tests to actually run.
//    Priority:
//      A) CLI args
//      B) unit_tests_to_stress_test.json
//      C) unit_tests_to_run.json
//
let testsToRun = [];

if (options.path.length > 0) {
  testsToRun = options.path;
} else if (fs.existsSync('unit_tests_to_stress_test.json')) {
  testsToRun = JSON.parse(
    fs.readFileSync(path.resolve('unit_tests_to_stress_test.json')),
  );
} else if (fs.existsSync('unit_tests_to_run.json')) {
  testsToRun = JSON.parse(
    fs.readFileSync(path.resolve('unit_tests_to_run.json')),
  );
}

if (!testsToRun || testsToRun.length === 0) {
  console.log('No unit tests to run');
  core.exportVariable('NO_APPS_TO_RUN', true);
  process.exit(0);
}

// signal downstream we do have apps/tests to run
core.exportVariable('NO_APPS_TO_RUN', false);

//
// 3) Build the test runner command
//
const reporterOption = options.reporter ? `--reporter ${options.reporter}` : '';

// mocha vs nyc coverage
const mochaBase = `BABEL_ENV=test NODE_ENV=test mocha --config ${
  options.config
} ${reporterOption}`;
const coverageReporter = options['coverage-html']
  ? '--reporter=html --retries 5'
  : '--reporter=json-summary --reporter mocha-multi-reporters --reporter-options configFile=config/mocha-multi-reporter.js --no-color --retries 5';

const coverageBase = `NODE_ENV=test nyc --all ${
  options.coverageHtml ? '--reporter=html' : ''
} ${coverageReporter}`;

const testRunner = options.coverage ? coverageBase : mochaBase;

//
// 4) Flatten and shell‑escape our test paths, then invoke
//
const filesArg = testsToRun.map(f => `'${f}'`).join(' ');
const cmd = `LOG_LEVEL=${options[
  'log-level'
].toLowerCase()} ${testRunner} --max-old-space-size=32768 ${filesArg}`;

runCommand(cmd);
