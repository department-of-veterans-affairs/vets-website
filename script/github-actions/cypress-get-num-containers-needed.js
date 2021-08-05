const core = require('@actions/core');
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
  core.exportVariable('ci_node_index', '[]');
} else if (numTests < 20) {
  core.exportVariable('ci_node_index', '[0]');
} else if (numTests < 40) {
  core.exportVariable('ci_node_index', '[0, 1]');
} else if (numTests < 60) {
  core.exportVariable('ci_node_index', '[0, 1, 2]');
} else if (numTests < 80) {
  core.exportVariable('ci_node_index', '[0, 1, 2, 3]');
} else if (numTests < 100) {
  core.exportVariable('ci_node_index', '[0, 1, 2, 3, 4]');
} else if (numTests < 120) {
  core.exportVariable('ci_node_index', '[0, 1, 2, 3, 4, 5]');
} else if (numTests < 140) {
  core.exportVariable('ci_node_index', '[0, 1, 2, 3, 4, 5, 6]');
} else core.exportVariable('ci_node_index', '[0, 1, 2, 3, 4, 5, 6, 7]');

return undefined;
