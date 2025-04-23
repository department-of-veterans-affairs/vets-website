/* eslint-disable no-await-in-loop */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const glob = require('glob');
const path = require('path');
const core = require('@actions/core');
const fs = require('fs');
const { runCommand } = require('../utils');
// For usage instructions see https://github.com/department-of-veterans-affairs/vets-website#unit-tests

// 1) CLI-options, with sensible defaults
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

// 2) Figure out coverage-include if using `--app-folder`
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

// 3) Build the Mocha vs NYC command prefixes
const reporterOption = options.reporter ? `--reporter ${options.reporter}` : '';

const mochaPath = `BABEL_ENV=test NODE_ENV=test mocha ${reporterOption}`;
const coverageReporter = options['coverage-html']
  ? '--reporter=html mocha --retries 5'
  : '--reporter=json-summary mocha --reporter mocha-multi-reporters --reporter-options configFile=config/mocha-multi-reporter.js --no-color --retries 5';
const coveragePath = `NODE_ENV=test nyc --all ${coverageInclude} ${coverageReporter}`;

const testRunner = options.coverage ? coveragePath : mochaPath;

// ──────────────────────────────────────────────────────────────────────────────
// 4) **NEW**: before you ever run NYC, ensure its output folder exists
if (options.coverage) {
  const nycDir = path.resolve(process.cwd(), '.nyc_output');
  if (!fs.existsSync(nycDir)) {
    fs.mkdirSync(nycDir, { recursive: true });
  }
}
// ──────────────────────────────────────────────────────────────────────────────

const configFile = options.config || 'config/mocha.json';

// 5) Figure out which tests to stress-verify vs. normal run
const testsToVerify = fs.existsSync('unit_tests_to_stress_test.json')
  ? JSON.parse(fs.readFileSync('unit_tests_to_stress_test.json'))
  : null;

// 6) Split your apps up across containers
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

const splitUnitTests = splitArray(
  allUnitTestDirs,
  Math.ceil(allUnitTestDirs.length / numContainers),
);
const appsToRun = options['app-folder']
  ? [options['app-folder']]
  : splitUnitTests[matrixStep];

// 7) Main execution
if (testsToVerify === null) {
  // Normal run (not stress-test)
  if (appsToRun && appsToRun.length > 0) {
    core.exportVariable('NO_APPS_TO_RUN', false);

    for (const dir of appsToRun) {
      const updatedPath = options['app-folder']
        ? options.path.map(p => `'${p}'`).join(' ')
        : options.path[0].replace(
            `/${specDirs}/`,
            `/${JSON.parse(dir).join('/')}/`,
          );
      const testsToRunFlag = options['app-folder']
        ? `--recursive ${updatedPath}`
        : `--recursive ${glob.sync(updatedPath).join(' ')}`;

      const command = `LOG_LEVEL=${options[
        'log-level'
      ].toLowerCase()} ${testRunner} --max-old-space-size=32768 --config ${configFile} ${testsToRunFlag}`;

      if (testsToRunFlag) {
        runCommand(command);
      } else {
        console.log('This app has no tests to run');
      }
    }
  } else {
    core.exportVariable('NO_APPS_TO_RUN', true);
  }
} else {
  // Stress test mode
  const appsToVerify = JSON.parse(process.env.APPS_TO_VERIFY)
    .filter(app => app.startsWith('src/applications'))
    .map(app => app.split('/')[2])
    .concat(
      JSON.parse(process.env.APPS_TO_VERIFY).filter(app =>
        app.startsWith('src/platform'),
      ),
    );

  async function runTests() {
    for (const app of appsToVerify) {
      console.log(app);
      const testsToRunList = testsToVerify
        .filter(
          test =>
            test.includes(`src/applications/${app}`) ||
            test.includes(`src/platform`),
        )
        .join(' ');
      if (testsToRunList) {
        const command = `LOG_LEVEL=${options[
          'log-level'
        ].toLowerCase()} ${testRunner} --max-old-space-size=8192 --config ${configFile} ${testsToRunList}`;
        try {
          await runCommand(command);
        } catch (err) {
          console.error(`Error running tests for app ${app}:`, err);
        }
      } else {
        console.log('This app has no tests to run');
      }
    }
  }

  runTests();
}
