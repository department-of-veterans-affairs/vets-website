const core = require('@actions/core');
const path = require('path');
const glob = require('glob');
const { integrationFolder, testFiles } = require('../../config/cypress.json');

// const pathsOfChangedFiles = process.env.CHANGED_FILE_PATHS.split(' ');
const filepaths = process.env.CHANGED_FILE_PATHS.split(' ');
const pathsOfChangedFiles = filepaths.filter(filepath => {
  return (
    filepath !== 'package.json' &&
    filepath !== 'yarn.lock' &&
    filepath !== 'script/github-actions/run-cypress-tests.js' &&
    filepath !== 'script/github-actions/select-cypress-tests.js' &&
    filepath !== '.github/workflows/continuous-integration.yml'
  );
});

function selectedTests() {
  // always run tests in src/platform/
  // const tests = [
  //   '/home/runner/work/vets-website/vets-website/src/platform/site-wide/side-nav/tests/e2e/sideNav.cypress.spec.js',
  //   '/home/runner/work/vets-website/vets-website/src/platform/site-wide/mega-menu/tests/megaMenu.cypress.spec.js',
  //   '/home/runner/work/vets-website/vets-website/src/platform/site-wide/user-nav/tests/e2e/00-required.cypress.spec.js',
  // ];
  const tests = [];
  const applicationNames = pathsOfChangedFiles.map(filePath => {
    return filePath.split('/')[2];
  });

  [...new Set(applicationNames)].forEach(name => {
    const selectedTestsPattern = path.join(
      __dirname,
      '../..',
      'src/applications',
      `${name}/tests/**/*.cypress.spec.js?(x)`,
    );

    tests.push(...glob.sync(selectedTestsPattern));
  });

  const defaultTestsPattern = path.join(
    __dirname,
    '../..',
    'src/platform',
    '**/tests/**/*.cypress.spec.js?(x)',
  );

  tests.push(...glob.sync(defaultTestsPattern));
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

let tests;

if (allMdFiles) {
  tests = [];
} else if (allSrcApplicationsFiles) {
  tests = selectedTests();
} else {
  tests = allTests();
}

const numTests = tests.length;

if (numTests === 0) {
  core.exportVariable('NUM_CONTAINERS', 0);
} else if (numTests < 20) {
  core.exportVariable('NUM_CONTAINERS', 1);
  core.exportVariable('CI_NODE_INDEX', [0]);
} else if (numTests < 40) {
  core.exportVariable('NUM_CONTAINERS', 2);
  core.exportVariable('CI_NODE_INDEX', [0, 1]);
} else if (numTests < 60) {
  core.exportVariable('NUM_CONTAINERS', 3);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2]);
} else if (numTests < 80) {
  core.exportVariable('NUM_CONTAINERS', 4);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3]);
} else if (numTests < 100) {
  core.exportVariable('NUM_CONTAINERS', 5);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4]);
} else if (numTests < 120) {
  core.exportVariable('NUM_CONTAINERS', 6);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5]);
} else if (numTests < 140) {
  core.exportVariable('NUM_CONTAINERS', 7);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5, 6]);
} else {
  core.exportVariable('NUM_CONTAINERS', 8);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5, 6, 7]);
}

if (numTests > 0) core.exportVariable('TESTS', tests);

return undefined;
