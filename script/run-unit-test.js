const printUnitTestHelp = require('./run-unit-test-help.js');
const commandLineArgs = require('command-line-args');
const { runCommand } = require('./utils');

// For usage instructions see https://github.com/department-of-veterans-affairs/vets-website#unit-tests

const defaultPath = './src/**/*.unit.spec.js?(x)';

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'log-level', type: String, defaultValue: 'debug' },
  { name: 'app-folder', type: String, defaultValue: null },
  { name: 'coverage', type: Boolean, defaultValue: false },
  { name: 'reporter', type: String, defaultValue: null },
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

const reporterOption = options.reporter ? `--reporter ${options.reporter}` : '';

if (options.help) {
  printUnitTestHelp();
  process.exit(0);
}

const mochaPath = `BABEL_ENV=test mocha ${reporterOption}`;
const coveragePath = `NODE_ENV=test nyc --all ${coverageInclude} --reporter=lcov --reporter=text --reporter=json-summary mocha --reporter mocha-junit-reporter --no-color --retries 5`;
const testRunner = options.coverage ? coveragePath : mochaPath;
const configFile = 'config/mocha.json';

runCommand(
  `LOG_LEVEL=${options[
    'log-level'
  ].toLowerCase()} ${testRunner} --max-old-space-size=4096 --config ${configFile} --recursive ${options.path
    .map(p => `'${p}'`)
    .join(' ')}`,
);
