/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const glob = require('glob');
const path = require('path');
const core = require('@actions/core');
const fs = require('fs');
const { runCommand } = require('../utils');

// For usage instructions see https://github.com/department-of-veterans-affairs/vets-website#unit-tests
const specDirs = '{src,script}';
const defaultPath = `./${specDirs}/**/*.unit.spec.js?(x)`;
const numContainers = process.env.NUM_CONTAINERS || 1;
const matrixStep = process.env.STEP || 0;

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'log-level', type: String, defaultValue: 'log' },
  { name: 'app-folder', type: String, defaultValue: null },
  { name: 'coverage', type: Boolean, defaultValue: false },
  { name: 'coverage-html', type: Boolean, defaultValue: false },
  { name: 'reporter', type: String, defaultValue: null },
  { name: 'help', alias: 'h', type: Boolean, defaultValue: false },
  { name: 'config', type: String, defaultValue: null },
  {
    name: 'path',
    type: String,
    defaultOption: true,
    multiple: true,
    defaultValue: [defaultPath],
  },
];

const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);

process.env.LOG_LEVEL = options['log-level'].toLowerCase();
process.env.NODE_ENV = 'test';
process.env.BABEL_ENV = 'test';

const allUnitTests = glob.sync(defaultPath);
const allUnitTestDirs = Array.from(
  new Set(
    allUnitTests.map(spec =>
      JSON.stringify(
        path
          .dirname(spec)
          .split('/')
          .slice(1, 4),
      ),
    ),
  ),
).filter(Boolean);

function splitArray(array, chunks) {
  const copy = [...array];
  const result = [];
  while (copy.length) {
    result.push(copy.splice(0, chunks));
  }
  return result;
}

let coverageInclude = '';
if (
  options['app-folder'] &&
  options.path.length === 1 &&
  options.path[0] === defaultPath
) {
  options.path[0] = options.path[0].replace(
    `/${specDirs}/`,
    `/src/applications/${options['app-folder']}/`,
  );
  const unitTestList = glob.sync(options.path[0]);
  if (!unitTestList.length) {
    console.log('There are no unit tests in the app folder.');
    process.exit(0);
  }
  coverageInclude = `--include 'src/applications/${options['app-folder']}/**'`;
}

const reporterOption = options.reporter ? `--reporter ${options.reporter}` : '';
const mochaPath = `mocha ${reporterOption}`;
const coverageReporter = options['coverage-html']
  ? '--reporter=html mocha --retries 5'
  : '--reporter=json-summary mocha --reporter mocha-multi-reporters --reporter-options configFile=config/mocha-multi-reporter.js --no-color --retries 5';
const coveragePath = `nyc --all ${coverageInclude} ${coverageReporter}`;

const testRunner = options.coverage ? coveragePath : mochaPath;
const configFile = options.config || 'config/mocha.json';

const testsToVerify = fs.existsSync('unit_tests_to_stress_test.json')
  ? JSON.parse(fs.readFileSync(path.resolve('unit_tests_to_stress_test.json')))
  : null;

const splitUnitTests = splitArray(
  allUnitTestDirs,
  Math.ceil(allUnitTestDirs.length / numContainers),
);
const appsToRun = options['app-folder']
  ? [options['app-folder']]
  : splitUnitTests[matrixStep] || [];

const allFilesThisSlice = appsToRun.flatMap(dir => {
  if (options['app-folder']) {
    return glob.sync(options.path[0]);
  }
  const pattern = options.path[0].replace(
    `/${specDirs}/`,
    `/${JSON.parse(dir).join('/')}/`,
  );
  return glob.sync(pattern);
});

if (allFilesThisSlice.length === 0) {
  console.log('No unit tests to run in this container, exiting early.');
  core.exportVariable('NO_APPS_TO_RUN', true);
  process.exit(0);
}

if (testsToVerify === null) {
  core.exportVariable('NO_APPS_TO_RUN', false);
  for (const dir of appsToRun) {
    let testFiles;
    if (options['app-folder']) {
      testFiles = glob.sync(options.path[0]);
    } else {
      const pattern = options.path[0].replace(
        `/${specDirs}/`,
        `/${JSON.parse(dir).join('/')}/`,
      );
      testFiles = glob.sync(pattern);
    }
    const filesArg = testFiles.map(f => `'${f}'`).join(' ');
    const command = `${testRunner} --max-old-space-size=32768 --config ${configFile} ${filesArg}`;
    runCommand(command);
  }
} else {
  const appsToVerify = JSON.parse(process.env.APPS_TO_VERIFY)
    .filter(app => app.startsWith('src/applications'))
    .map(app => app.split('/')[2])
    .concat(
      JSON.parse(process.env.APPS_TO_VERIFY).filter(app =>
        app.startsWith('src/platform'),
      ),
    );

  (async function runTests() {
    core.exportVariable('NO_APPS_TO_RUN', false);
    for (const app of appsToVerify) {
      const matching = testsToVerify.filter(
        test =>
          test.includes(`src/applications/${app}`) ||
          test.includes('src/platform'),
      );
      if (!matching.length) {
        console.log(`No tests for ${app}`);
        continue;
      }
      const filesArg = matching.map(f => `'${f}'`).join(' ');
      const command = `${testRunner} --max-old-space-size=8192 --config ${configFile} ${filesArg}`;
      try {
        await runCommand(command);
      } catch (err) {
        console.error(`Error running tests for ${app}:`, err);
      }
    }
  })();
}
