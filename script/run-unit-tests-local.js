/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const glob = require('glob');
const printUnitTestHelp = require('./run-unit-test-help');
const { runCommand } = require('./utils');
// For usage instructions see https://github.com/department-of-veterans-affairs/vets-website#unit-tests

const specDirs = '{src,script}';
const defaultPath = `./${specDirs}/**/*.unit.spec.js?(x)`;
const configFile = 'config/mocha.json';

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'log-level', type: String, defaultValue: 'log' },
  { name: 'app-folder', type: String, defaultValue: null },
  { name: 'plat-folder', type: String, defaultValue: null },
  { name: 'coverage', type: Boolean, defaultValue: false },
  { name: 'coverage-html', type: Boolean, defaultValue: false },
  { name: 'reporter', type: String, defaultValue: 'progress' },
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

let coverageInclude = '';
const OPTIONS = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);
const LEVEL = OPTIONS['log-level'].toLowerCase();

const runFolderSetup = optionType => {
  if (['app-folder', 'plat-folder'].includes(optionType)) {
    const directoryFolder =
      optionType === 'app-folder' ? 'applications' : 'platform';

    const updatedPath = `/src/${directoryFolder}/${OPTIONS[optionType]}/`;

    OPTIONS.path[0] = OPTIONS.path[0].replace(`/${specDirs}/`, updatedPath);

    coverageInclude = `--include 'src/${directoryFolder}/${
      OPTIONS[optionType]
    }/**'`;
  }
  coverageInclude = `--include '${defaultPath}'`;
};

const getReporterOptions = () => {
  return `--reporter=${OPTIONS.reporter}`;
};

const determineTestRunner = () => {
  const reporterOptions = getReporterOptions();
  const mochaPath = `BABEL_ENV=test NODE_ENV=test mocha ${reporterOptions}`;
  const coverageReporter = OPTIONS['coverage-html']
    ? '--reporter=html mocha --retries 5'
    : '--reporter=json-summary mocha --reporter mocha-multi-reporters --reporter-options configFile=config/mocha-multi-reporter.js --no-color --retries 5';
  const coveragePath = `NODE_ENV=test nyc --all ${coverageInclude} ${coverageReporter}`;
  return OPTIONS.coverage ? coveragePath : mochaPath;
};

const checkOptions = () => {
  if (
    OPTIONS['app-folder'] &&
    OPTIONS.path[0] === defaultPath &&
    OPTIONS.path.length === 1
  ) {
    runFolderSetup('app-folder');
  }

  if (
    OPTIONS['plat-folder'] &&
    OPTIONS.path[0] === defaultPath &&
    OPTIONS.path.length === 1
  ) {
    runFolderSetup('plat-folder');
  }

  // do all files
  runFolderSetup();
};

const runUnitTests = ({
  'plat-folder': platFolder,
  'app-folder': appFolder,
  path: unitTestPath,
}) => {
  const testRunner = determineTestRunner();
  const command = `LOG_LEVEL=${LEVEL} ${testRunner} --max-old-space-size=8192 --config ${configFile}`;
  const allUnitTests =
    !platFolder && !appFolder
      ? glob
          .sync(defaultPath)
          .map(test => `'${test}'`)
          .join(' ')
      : '';
  const testsToRun =
    !platFolder && !appFolder
      ? `--recursive ${allUnitTests}`
      : `--recursive '${unitTestPath}'`.replace(/,/g, ' ');

  // --exit forces Mocha to exit for lingering ongoing processes
  // read more: https://mochajs.org/#-exit
  const commandToRun = `${command} ${testsToRun} --exit`;
  runCommand(commandToRun);
};

const run = () => {
  if (OPTIONS.help) {
    printUnitTestHelp();
    process.exit(0);
  }
  checkOptions();
  runUnitTests(OPTIONS);
};

run();
