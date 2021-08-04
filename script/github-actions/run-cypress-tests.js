const path = require('path');
const glob = require('glob');
const { runCommandSync } = require('../utils');
const { integrationFolder, testFiles } = require('../../config/cypress.json');

// const pathsOfChangedFiles = process.env.CHANGED_FILE_PATHS.split(' '); // commented out for testing purposes
// the following is for testing purposes
const filepaths = process.env.CHANGED_FILE_PATHS.split(' ');
const pathsOfChangedFiles = filepaths.filter(filepath => {
  return (
    filepath !== '.github/workflows/continuous-integration.yml' &&
    filepath !== 'script/github-actions/run-cypress-tests.js'
  );
});

function getSliceOfTests(tests, divider) {
  return tests
    .slice(
      Number(process.env.STEP) * divider,
      (Number(process.env.STEP) + 1) * divider,
    )
    .join(',');
}

function selectedTests() {
  const tests = [];
  const applicationNames = pathsOfChangedFiles.map(filePath => {
    return filePath.split('/')[2];
  });

  // eslint-disable-next-line no-console
  console.log('applicationNames: ', applicationNames);

  [...new Set(applicationNames)].forEach(name => {
    const pattern = path.join(
      __dirname,
      '../..',
      `src/applications/${name}`,
      'tests/**/*.cypress.spec.js?(x)',
    );

    // eslint-disable-next-line no-console
    console.log('Selected tests pattern: ', pattern);

    const appTests = glob.sync(pattern);

    tests.push(...appTests);

    // eslint-disable-next-line no-console
    console.log('Contents of tests array on each app name iteration: ', tests);
  });

  const divider = Math.ceil(tests.length / 8);
  return getSliceOfTests(tests, divider);
}

function allTests() {
  const pattern = path.join(__dirname, '../..', integrationFolder, testFiles);
  // eslint-disable-next-line no-console
  console.log('All tests pattern: ', pattern);
  const tests = glob.sync(pattern);
  const divider = Math.ceil(tests.length / 8);
  return getSliceOfTests(tests, divider);
}

let allMdFiles = true;
let allSrcApplicationsFiles = true;
let batch;

for (let i = 0; i < pathsOfChangedFiles.length; i += 1) {
  if (!pathsOfChangedFiles[i].startsWith('src/applications')) {
    allSrcApplicationsFiles = false;
  }

  if (!pathsOfChangedFiles[i].endsWith('.md')) {
    allMdFiles = false;
  }

  if (allMdFiles === false && allSrcApplicationsFiles === false) {
    break;
  }
}

if (allMdFiles) {
  batch = '';
} else if (allSrcApplicationsFiles) {
  batch = selectedTests();
} else {
  batch = allTests();
}

// eslint-disable-next-line no-console
console.log('allMdFiles: ', allMdFiles);
// eslint-disable-next-line no-console
console.log('allSrcApplicationsFiles: ', allSrcApplicationsFiles);
// eslint-disable-next-line no-console
console.log('batch: ', batch);

const status = runCommandSync(
  `yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec '${batch}'`,
);

process.exit(status);
