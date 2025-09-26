/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const { runCommand } = require('../utils');

// Configuration
const DEFAULT_SPEC_PATTERN = '{src,script}/**/*.unit.spec.js?(x)';
const STATIC_PAGES_PATTERN = 'src/platform/site-wide/**/*.unit.spec.js?(x)';
const MAX_MEMORY = '8192'; // Reduced from 32768 to prevent memory issues

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

// Get command line options
const options = commandLineArgs(COMMAND_LINE_OPTIONS);
// log this out to determing if we still need this

// Helper function to get test paths
function getTestPaths() {
  if (options['full-suite']) {
    return glob.sync(DEFAULT_SPEC_PATTERN);
  }

  const changedFiles = process.env.CHANGED_FILES
    ? process.env.CHANGED_FILES.split(' ').filter(
        file => !file.endsWith('.md') && !file.startsWith('.github/workflows'),
      )
    : [];

  if (changedFiles.length === 0) {
    return glob.sync(STATIC_PAGES_PATTERN);
  }

  // May need to convert this output into an array?
  if (process.env.NODE_COMPATBILITY_VERIFICATION) {
    return JSON.parse(fs.readFileSync(path.resolve(`changed_unit_tests.json`)));
  }

  // Get app-specific tests
  const appTests = changedFiles
    .filter(file => file.startsWith('src/applications/'))
    .map(file => {
      const appName = file.split('/')[2];
      return `src/applications/${appName}/**/*.unit.spec.js?(x)`;
    })
    .flatMap(pattern => glob.sync(pattern));

  // Get platform tests
  const platformTests = changedFiles
    .filter(file => file.startsWith('src/platform/'))
    .map(file => {
      const platformPath = file
        .split('/')
        .slice(0, 3)
        .join('/');
      return `${platformPath}/**/*.unit.spec.js?(x)`;
    })
    .flatMap(pattern => glob.sync(pattern));

  // Always include static pages tests
  const staticPagesTests = glob.sync(STATIC_PAGES_PATTERN);

  return [...new Set([...appTests, ...platformTests, ...staticPagesTests])];
}

function getTestGroups() {
  const staticPages = glob.sync(STATIC_PAGES_PATTERN);

  // If --full-suite: derive from the full glob, else from changed paths
  const baseTests = options['full-suite']
    ? glob.sync(DEFAULT_SPEC_PATTERN)
    : getTestPaths();

  // If getTestPaths() returned static-only when nothing changed, still group it.
  if (baseTests.length === 0) {
    return staticPages.length
      ? [{ name: 'platform-static-pages', tests: staticPages }]
      : [];
  }

  const groups = {};
  for (const file of baseTests) {
    if (file.startsWith('src/applications/')) {
      const app = file.split('/')[2];
      const key = `app-${app}`;
      (groups[key] = groups[key] || []).push(file);
    } else if (file.startsWith('src/platform/')) {
      const area = file.split('/')[2] || 'root';
      const key = `platform-${area}`;
      (groups[key] = groups[key] || []).push(file);
    } else {
      (groups.misc = groups.misc || []).push(file);
    }
  }

  if (staticPages.length) {
    groups['platform-static-pages'] = groups['platform-static-pages'] || [];
    groups['platform-static-pages'].push(...staticPages);
  }
  return Object.entries(groups).map(([name, tests]) => ({
    name,
    tests: [...new Set(tests)],
  }));
}

// Helper function to build test command
// function buildTestCommand(testPaths) {
//   const coverageInclude = options['app-folder']
//     ? `--include 'src/applications/${options['app-folder']}/**'`
//     : '';

//   const reporterOption = options.reporter
//     ? `--reporter ${options.reporter}`
//     : '';
//   const coverageReporter = options['coverage-html']
//     ? '--reporter=html mocha --retries 5'
//     : '--reporter=json-summary mocha --reporter mocha-multi-reporters --reporter-options configFile=config/mocha-multi-reporter.js --no-color --retries 5';

//   const testRunner = options.coverage
//     ? `NODE_ENV=test nyc --all ${coverageInclude} ${coverageReporter}`
//     : `BABEL_ENV=test NODE_ENV=test mocha ${reporterOption}`;

//   return `STEP=unit-tests LOG_LEVEL=${options[
//     'log-level'
//   ].toLowerCase()} ${testRunner} --max-old-space-size=${MAX_MEMORY} --config ${
//     options.config
//   } ${testPaths.join(' ')}`;
// }

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

// Replacement logic for buildTestCommand that organizes mocha runs by app
function buildGroupCommand(groupName, testPaths) {
  ensureDir('reports/unit');

  const coverageInclude = options['app-folder']
    ? `--include 'src/applications/${options['app-folder']}/**'`
    : '';
  const jsonOut = `reports/unit/${groupName}.json`;

  const baseMocha = `--max-old-space-size=${MAX_MEMORY} --config ${
    options.config
  } ${testPaths.join(' ')}`;
  let runner;

  if (options.coverage) {
    const coverageReporter = options['coverage-html']
      ? '--reporter=html mocha --retries 5'
      : '--reporter=json-summary mocha --no-color --retries 5';
    runner = `NODE_ENV=test nyc --all ${coverageInclude} ${coverageReporter} ${baseMocha}`;
  } else {
    runner = `BABEL_ENV=test NODE_ENV=test mocha --reporter mocha-multi-reporters --no-color --retries 5 ${baseMocha}`;
  }

  return `STEP=unit-tests LOG_LEVEL=${options[
    'log-level'
  ].toLowerCase()} ${runner} > ${jsonOut}`;
}

// Main execution
async function main() {
  try {
    const groups = getTestGroups().filter(g => g.tests.length > 0);

    if (groups.length === 0) {
      console.log('No tests to run');
      core.exportVariable('tests_ran', 'false');
      return;
    }

    console.log(`Discovered ${groups.length} unit test group(s).`);

    for (const { name, tests } of groups) {
      console.log(
        `\n==> Running group: ${name} (${tests.length} spec${
          tests.length === 1 ? '' : 's'
        })`,
      );
      const command = buildGroupCommand(name, tests);
      runCommand(command);
    }

    core.exportVariable('tests_ran', 'true');
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

main();
