const printUnitTestHelp = require('./run-unit-test-help.js');
const commandLineArgs = require('command-line-args');
const { runCommand } = require('./utils');

const defaultPath = './src/**/*.unit.spec.js?(x)';
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

if (
  options['app-folder'] &&
  options.path[0] === defaultPath &&
  options.path.length === 1
) {
  options.path[0] = options.path[0].replace(
    '/src/',
    `/src/applications/${options['app-folder']}/`,
  );
}

if (options.help) {
  printUnitTestHelp();
  process.exit(0);
}

const mochaPath = 'BABEL_ENV=test mocha';
const coveragePath =
  'NODE_ENV=test nyc --all --reporter=lcov --reporter=text-summary mocha --reporter mocha-junit-reporter --no-color';
const testRunner = options.coverage ? coveragePath : mochaPath;
const mochaOpts =
  'src/platform/testing/unit/mocha.opts src/platform/testing/unit/helper.js';

// Otherwise, run the command
runCommand(
  `LOG_LEVEL=${options[
    'log-level'
  ].toLowerCase()} ${testRunner} --opts ${mochaOpts} --recursive ${options.path
    .map(p => `'${p}'`)
    .join(' ')}`,
  options.coverage ? null : 0,
);
