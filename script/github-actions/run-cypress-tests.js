const path = require('path');
const glob = require('glob');
const { runCommandSync } = require('../utils');
const { integrationFolder, testFiles } = require('../../config/cypress.json');

const pathsOfChangedFiles = process.env.CHANGED_FILE_PATHS.split(' ');

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

  [...new Set(applicationNames)].forEach(name => {
    const pattern = path.join(
      __dirname,
      '../..',
      `src/applictions/${name}`,
      'tests/**/*.cypress.spec.js?(x)',
    );

    tests.push(...glob.sync(pattern));
  });

  const divider = Math.ceil(tests.length / 8);
  return getSliceOfTests(tests, divider);
}

function allTests() {
  const pattern = path.join(__dirname, '../..', integrationFolder, testFiles);
  const tests = glob.sync(pattern);
  const divider = Math.ceil(tests.length / 8);
  return getSliceOfTests(tests, divider);
}

let allMdFiles = true;
let allSrcApplicationFiles = true;
let batch;

for (let i = 0; i < pathsOfChangedFiles.length; i += 1) {
  if (!pathsOfChangedFiles[i].startsWith('src/applications')) {
    allSrcApplicationFiles = false;
  }

  if (!pathsOfChangedFiles[i].endsWith('.md')) {
    allMdFiles = false;
  }

  if (allMdFiles === false && allSrcApplicationFiles === false) {
    break;
  }
}

if (allMdFiles) {
  batch = '';
} else if (allSrcApplicationFiles) {
  batch = selectedTests();
} else {
  batch = allTests();
}

const status = runCommandSync(
  `yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec '${batch}'`,
);

process.exit(status);
