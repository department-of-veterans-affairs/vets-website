/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const glob = require('glob');
const path = require('path');
const { promisify } = require('util');
const printUnitTestHelp = require('./run-unit-test-help');
const { runCommand } = require('./utils');
// For usage instructions see https://github.com/department-of-veterans-affairs/vets-website#unit-tests
const exec = promisify(require('child_process').exec);

const specDirs = '{src,script}';
const defaultPath = `./${specDirs}/**/*.unit.spec.js?(x)`;

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

if (options.help) {
  printUnitTestHelp();
  process.exit(0);
}

const mochaPath = `BABEL_ENV=test NODE_ENV=test mocha ${reporterOption}`;
const coverageReporter = options['coverage-html']
  ? '--reporter=html mocha --retries 5'
  : '--reporter=json-summary mocha --reporter mocha-multi-reporters --reporter-options configFile=config/mocha-multi-reporter.js --no-color --retries 5';
const coveragePath = `NODE_ENV=test nyc --all ${coverageInclude} ${coverageReporter}`;
const testRunner = options.coverage ? coveragePath : mochaPath;
const configFile = options.config ? options.config : 'config/mocha.json';

async function runCommandAsync(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    exec(command, (error, stdout) => {
      if (error) {
        console.error(`Error: ${error}`);
        reject(error);
      } else {
        console.log(`Output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

async function runTests() {
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
  )
    .filter(spec => spec !== undefined)
    .map(directory => JSON.parse(directory).join('/'));
  for (const app of allUnitTestDirs) {
    const command = `LOG_LEVEL=${options[
      'log-level'
    ].toLowerCase()} ${testRunner} --max-old-space-size=4096 --config ${configFile} "${`${app}/**/*.unit.spec.js?(x)`}"`;

    try {
      /* eslint-disable-next-line no-await-in-loop */
      await runCommandAsync(command);
    } catch (error) {
      console.log(error);
    }
  }
}

if (options.path[0] !== defaultPath) {
  const command = `LOG_LEVEL=${options[
    'log-level'
  ].toLowerCase()} ${testRunner} --max-old-space-size=4096 --config ${configFile} ${`--recursive ${options.path
    .map(p => `'${p}'`)
    .join(' ')}`}`;

  runCommand(command);
} else {
  runTests().then(() => {
    console.log('All Tests Complete');
  });
}
