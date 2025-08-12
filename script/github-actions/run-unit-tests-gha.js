/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const core = require('@actions/core');
const { runCommand } = require('../utils');

// Configuration
const DEFAULT_SPEC_PATTERN = '{src,script}/**/*.unit.spec.js?(x)';
const STATIC_PAGES_PATTERN = 'src/platform/site-wide/**/*.unit.spec.js?(x)';
const MAX_MEMORY = '8192'; // safer for CI; bump if needed

// Command line options
const COMMAND_LINE_OPTIONS = [
  { name: 'log-level', type: String, defaultValue: 'log' },
  { name: 'app-folder', type: String, defaultValue: null },
  { name: 'coverage', type: Boolean, defaultValue: false },
  { name: 'coverage-html', type: Boolean, defaultValue: false },
  { name: 'reporter', type: String, defaultValue: null },
  { name: 'help', alias: 'h', type: Boolean, defaultValue: false },
  { name: 'config', type: String, defaultValue: 'config/mocha.json' },
  { name: 'full-suite', type: Boolean, defaultValue: false },
  {
    name: 'path',
    type: String,
    defaultOption: true,
    multiple: true,
    defaultValue: [DEFAULT_SPEC_PATTERN],
  },
];

const options = commandLineArgs(COMMAND_LINE_OPTIONS);

function parseChangedFiles() {
  return (process.env.CHANGED_FILES || '')
    .split(/\s+/)
    .map(file => file.replace(/^['"]|['"]$/g, ''))
    .map(file => file.trim())
    .filter(Boolean)
    .map(file => file.replace(/^\.\//, '').replace(/\\/g, '/'))
    .filter(
      file => !file.endsWith('.md') && !file.startsWith('.github/workflows'),
    );
}

function getTestPaths() {
  if (options['full-suite']) return [DEFAULT_SPEC_PATTERN];

  if (options['app-folder']) {
    return [
      `src/applications/${options['app-folder']}/**/*.unit.spec.js?(x)`,
      'script/**/*.unit.spec.js?(x)',
      STATIC_PAGES_PATTERN,
    ];
  }

  const changedFiles = parseChangedFiles();
  const changes = changedFiles.filter(
    file =>
      file.startsWith('src/applications/') || file.startsWith('src/platform/'),
  );

  if (changes.length > 0) {
    const appBases = new Set(
      changes
        .filter(file => file.startsWith('src/applications/'))
        .map(file => `src/applications/${file.split('/')[2]}`),
    );
    const platformBases = new Set(
      changes.filter(file => file.startsWith('src/platform/')).map(file =>
        file
          .split('/')
          .slice(0, 3)
          .join('/'),
      ),
    );

    return [
      ...[...appBases].map(b => `${b}/**/*.unit.spec.js?(x)`),
      ...[...platformBases].map(b => `${b}/**/*.unit.spec.js?(x)`),
      STATIC_PAGES_PATTERN,
    ];
  }

  const cliPatterns = Array.isArray(options.path)
    ? options.path
    : [options.path];
  return [...new Set(cliPatterns)];
}

function extGlobFix(str) {
  // cleanup parentheses in pattern string
  return `'${String(str).replace(/'/g, `'\\''`)}'`;
}

function buildCommandForMocha(testPaths) {
  const coverageInclude = options['app-folder']
    ? `--include 'src/applications/${options['app-folder']}/**'`
    : '';

  const reporterOption = options.reporter
    ? `--reporter ${options.reporter}`
    : '';
  const coverageReporter = options['coverage-html']
    ? '--reporter=html mocha --retries 5'
    : '--reporter=json-summary mocha --reporter mocha-multi-reporters --reporter-options configFile=config/mocha-multi-reporter.js --no-color --retries 5';

  const testRunner = options.coverage
    ? `NODE_ENV=test nyc --all ${coverageInclude} ${coverageReporter}`
    : `BABEL_ENV=test NODE_ENV=test mocha ${reporterOption}`;

  const fixed = testPaths.map(extGlobFix).join(' ');

  return `STEP=unit-tests LOG_LEVEL=${options[
    'log-level'
  ].toLowerCase()} ${testRunner} --max-old-space-size=${MAX_MEMORY} --config ${
    options.config
  } ${fixed}`;
}

async function main() {
  try {
    const testPaths = getTestPaths();
    if (testPaths.length === 0) {
      console.log('No tests to run');
      core.exportVariable('tests_ran', 'false');
      return;
    }
    console.log('[DEBUG] Using patterns:', testPaths);
    const command = buildCommandForMocha(testPaths);
    await runCommand(command);
    core.exportVariable('tests_ran', 'true');
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

main();
