/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const commandLineArgs = require('command-line-args');
const { execSync } = require('child_process');

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
core.exportVariable('NO_APPS_TO_RUN', false);

const filesArg = testsToRun.map(f => `'${f}'`).join(' ');

const envPrefix = `LOG_LEVEL=${options['log-level'].toLowerCase()}`;
let cmd;

if (options.coverage) {
  const reporterFlag = options['coverage-html']
    ? '--reporter=html'
    : '--reporter=json-summary --reporter mocha-multi-reporters --reporter-options configFile=config/mocha-multi-reporter.js --no-color';
  cmd = [
    envPrefix,
    'NODE_ENV=test',
    'npx nyc --all',
    reporterFlag,
    '--retries 5',
    'mocha',
    '--require @babel/register',
    `--config ${options.config}`,
    '--extension js,jsx',
    '--max-old-space-size=32768',
    filesArg,
  ].join(' ');
} else {
  const reporterFlag = options.reporter ? `--reporter ${options.reporter}` : '';
  cmd = [
    envPrefix,
    'BABEL_ENV=test NODE_ENV=test',
    'npx mocha',
    '--require @babel/register',
    `--config ${options.config}`,
    '--extension js,jsx',
    reporterFlag,
    '--max-old-space-size=32768',
    filesArg,
  ]
    .filter(Boolean)
    .join(' ');
}

execSync(cmd, { stdio: 'inherit', shell: '/bin/bash' });
