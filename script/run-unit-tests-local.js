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
const defaultPath = `./${specDirs}/**/*.unit.spec.@(jsx|js)`;

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'log-level', type: String, defaultValue: 'warn' },
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
  { name: 'legacy', alias: 'l', type: Boolean },
  { name: 'tame', alias: 't', type: Boolean },
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

const addWildcardAndQuote = (p, qt = "'") => {
  /* qt = false, ads no quote to string; user can choose between  single or double quote with single being default */
  const q = !qt ? '' : (/["']/.test(qt) && qt) || "'";
  return options.tame || options['app-folder'] || p.indexOf('.unit.spec.js') > 0
    ? `${q}${p}${q}`
    : `${q}${p}/**/*.unit.spec.@(jsx|js)${q}`.replace(/\/{2,}/, '/');
};

async function runCommandAsync(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    exec(command, (error, stdout) => {
      if (error) {
        console.error(`Runtime ${error}`);
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
    const command = `shopt -s extglob; LOG_LEVEL=${options[
      'log-level'
    ].toLowerCase()} ${testRunner} --max-old-space-size=8192 --config ${configFile} "${`${app}/**/*.unit.spec.@(jsx|js)`}"`;

    try {
      /* eslint-disable-next-line no-await-in-loop */
      await runCommandAsync(command);
    } catch (error) {
      console.log(error);
    }
  }
}

async function runCommandIndividually(paths) {
  const allUnitTests = paths.flatMap(p =>
    glob.sync(addWildcardAndQuote(p, false)),
  );
  console.log(allUnitTests.join(' '));
  const filepaths = allUnitTests.map(p => `'${p}'`);
  for (const fp of filepaths) {
    const command = `shopt -s extglob; LOG_LEVEL=${options[
      'log-level'
    ].toLowerCase()} ${testRunner} --max-old-space-size=8192 --config ${configFile} ${fp}`;
    try {
      /* eslint-disable-next-line no-await-in-loop */
      await runCommandAsync(command);
    } catch {
      console.log(`Continuing loop after reported runtime error.`);
    }
  }
}

if (options.path[0] !== defaultPath) {
  const filepaths = options.path.map(p => addWildcardAndQuote(p));
  const command = `shopt -s extglob; LOG_LEVEL=${options[
    'log-level'
  ].toLowerCase()} ${testRunner} --max-old-space-size=8192 --config ${configFile} ${filepaths.join(
    ' ',
  )}`;
  if (options.legacy) {
    console.log(`Sent CLI command:${command}`);
    runCommand(command);
  } else {
    runCommandIndividually(options.path).then(() => {
      console.log('Selected Tests Complete');
    });
  }
} else {
  runTests().then(() => {
    console.log('All Tests Complete');
  });
}
