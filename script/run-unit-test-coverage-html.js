/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const glob = require('glob');
const { runCommand } = require('./utils');

// For usage instructions see https://github.com/department-of-veterans-affairs/vets-website#unit-tests

const specDirs = '{src,script}';
const defaultPath = `./${specDirs}/**/*.unit.spec.js?(x)`;

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'log-level', type: String, defaultValue: 'log' },
  { name: 'app-folder', type: String, defaultValue: null },
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

const coveragePath = `NODE_ENV=test nyc --all ${coverageInclude} --reporter=html mocha`;
const configFile = options.config ? options.config : 'config/mocha.json';

const command = `LOG_LEVEL=${options[
  'log-level'
].toLowerCase()} ${coveragePath} --max-old-space-size=4096 --config ${configFile} --recursive ${options.path
  .map(p => `'${p}'`)
  .join(' ')}`;

console.log(command);

runCommand(command);
