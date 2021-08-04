const path = require('path');
const glob = require('glob');
const { integrationFolder, testFiles } = require('../../config/cypress.json');

const pathsOfChangedFiles = process.env.CHANGED_FILE_PATHS.split(' ');

function selectedTests() {
  const tests = [];
  const applicationNames = pathsOfChangedFiles.map(filePath => {
    return filePath.split('/')[2];
  });

  [...new Set(applicationNames)].forEach(name => {
    const pattern = path.join(
      __dirname,
      '../..',
      `src/applications/${name}`,
      'tests/**/*.cypress.spec.js?(x)',
    );

    const appTests = glob.sync(pattern);
    tests.push(...appTests);
  });

  return tests;
}

function allTests() {
  const pattern = path.join(__dirname, '../..', integrationFolder, testFiles);
  return glob.sync(pattern);
}

let allMdFiles = true;
let allSrcApplicationsFiles = true;

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

let batch;

if (allMdFiles) {
  batch = [];
} else if (allSrcApplicationsFiles) {
  batch = selectedTests();
} else {
  batch = allTests();
}

const numTests = batch.length;

if (numTests === 0) {
  return 0;
} else if (numTests < 20) {
  return 1;
} else if (numTests < 40) {
  return 2;
} else if (numTests < 60) {
  return 3;
} else if (numTests < 80) {
  return 4;
} else if (numTests < 100) {
  return 5;
} else if (numTests < 120) {
  return 6;
} else if (numTests < 140) {
  return 7;
} else return 8;
