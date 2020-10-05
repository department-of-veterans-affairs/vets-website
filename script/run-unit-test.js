const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const printUnitTestHelp = require('./run-unit-test-help.js');
const commandLineArgs = require('command-line-args');
const { runCommand, runCommandSync } = require('./utils');

// For usage instructions see https://github.com/department-of-veterans-affairs/vets-website#unit-tests

const defaultPath = './src/**/*.unit.spec.js?(x)';

// const allUnitTests = glob.sync('{src,test}/**/*.unit.spec.js?(x)');

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'log-level', type: String, defaultValue: 'log' },
  { name: 'app-folder', type: String, defaultValue: null },
  { name: 'coverage', type: Boolean, defaultValue: false },
  { name: 'help', alias: 'h', type: Boolean, defaultValue: false },
  {
    name: 'path',
    type: String,
    defaultOption: true,
    multiple: true,
    defaultValue: [defaultPath],
  },
];
const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);
let coverageInclude = '';

if (
  options['app-folder'] &&
  options.path[0] === defaultPath &&
  options.path.length === 1
) {
  options.path[0] = options.path[0].replace(
    '/src/',
    `/src/applications/${options['app-folder']}/`,
  );
  coverageInclude = `--include 'src/applications/${options['app-folder']}/**'`;
}

if (options.help) {
  printUnitTestHelp();
  process.exit(0);
}

const mochaPath = 'BABEL_ENV=test mocha';
const coveragePath = `NODE_ENV=test nyc --all ${coverageInclude} --reporter=lcov --reporter=text --reporter=json-summary mocha --reporter mocha-junit-reporter --no-color`;
const testRunner = options.coverage ? coveragePath : mochaPath;
const mochaOpts =
  'src/platform/testing/unit/mocha.opts src/platform/testing/unit/helper.js';

const logLevel = options['log-level'].toLowerCase();
const forcedExitCode = options.coverage ? null : 0;
const testDirectories = options.path;

if (testDirectories[0] === defaultPath) {
  const allUnitTests = glob.sync(defaultPath);

  const unitTestDirectories = new Set(
    allUnitTests.map(unitTest => {
      // Start with './src/applications/tests/config/benefitsSelection.unit.spec.js'
      const directory = path.dirname(unitTest);
      const directoryPathArray = directory.split(path.sep);

      let subdirectoryDepth = 3;

      if (directoryPathArray[2] === 'applications') {
        subdirectoryDepth = 4;
      }

      // Reduce to './src/applications//'
      return directoryPathArray.slice(0, subdirectoryDepth).join(path.sep);
    }),
  );

  const wildCard = `${path.sep}**${path.sep}*.unit.spec.js?(x)`;

  let isPassing = true;

  unitTestDirectories.forEach(unitTestDirectory => {
    // eslint-disable-next-line no-console
    console.log(chalk.blue(`Test suite: ${unitTestDirectory}`));

    const command = `LOG_LEVEL=${logLevel} ${testRunner} --max-old-space-size=4096 --opts ${mochaOpts} --recursive "${unitTestDirectory}${wildCard}"`;
    const exitStatus = runCommandSync(command);

    if (exitStatus !== 0) {
      isPassing = false;
    }
  });

  if (!isPassing) process.exitCode = 1;
} else {
  const testDirectoriesEscaped = options.path.map(p => `'${p}'`).join(' ');

  const command = `LOG_LEVEL=${logLevel} ${testRunner} --max-old-space-size=4096 --opts ${mochaOpts} --recursive ${testDirectoriesEscaped}`;

  // Otherwise, run the command
  runCommand(command, forcedExitCode);
}
