/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const glob = require('glob');
const path = require('path');
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
).filter(spec => spec !== undefined);

function splitArray(array, chunks) {
  const [...arrayCopy] = array;
  const arrayChunks = [];
  while (arrayCopy.length) {
    arrayChunks.push(arrayCopy.splice(0, chunks));
  }
  return arrayChunks;
}
const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);
let coverageInclude = '';

if (
  options['app-folder'] &&
  options.path[0] === defaultPath &&
  options.path.length === 1
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

const mochaPath = `BABEL_ENV=test NODE_ENV=test mocha ${reporterOption}`;
const coverageReporter = options['coverage-html']
  ? '--reporter=html mocha --retries 5'
  : '--reporter=json-summary mocha --reporter mocha-multi-reporters --reporter-options configFile=config/mocha-multi-reporter.js --no-color --retries 5';
const coveragePath = `NODE_ENV=test nyc --all ${coverageInclude} ${coverageReporter}`;
const testRunner = options.coverage ? coveragePath : mochaPath;
const configFile = options.config ? options.config : 'config/mocha.json';
let testsToVerify = null;
if (process.env.TESTS_TO_VERIFY) {
  testsToVerify = JSON.parse(process.env.TESTS_TO_VERIFY).join(' ');
}

const splitUnitTests = splitArray(
  allUnitTestDirs,
  Math.ceil(allUnitTestDirs.length / numContainers),
);
const appsToRun = options['app-folder']
  ? [options['app-folder']]
  : splitUnitTests[matrixStep];
if (testsToVerify === null) {
  for (const dir of appsToRun) {
    const updatedPath = options['app-folder']
      ? options.path.map(p => `'${p}'`).join(' ')
      : options.path[0].replace(
          `/${specDirs}/`,
          `/${JSON.parse(dir).join('/')}/`,
        );
    const testsToRun = options['app-folder']
      ? `--recursive ${updatedPath}`
      : `--recursive ${glob.sync(updatedPath)}`;
    const command = `LOG_LEVEL=${options[
      'log-level'
    ].toLowerCase()} ${testRunner} --max-old-space-size=8192 --config ${configFile} ${testsToRun.replace(
      /,/g,
      ' ',
    )} `;
    if (testsToRun !== '') {
      runCommand(command);
    } else {
      console.log('This app has no tests to run');
    }
  }
} else {
  const command = `LOG_LEVEL=${options[
    'log-level'
  ].toLowerCase()} ${testRunner} --max-old-space-size=8192 --config ${configFile} ${testsToVerify}`;
  runCommand(command);
}
