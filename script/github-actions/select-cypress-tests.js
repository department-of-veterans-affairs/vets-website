const core = require('@actions/core');
const path = require('path');
const glob = require('glob');
const { integrationFolder, testFiles } = require('../../config/cypress.json');
const graph = require('../../config/cross_app_import_graph.json');

const IS_MASTER_BUILD = process.env.IS_MASTER_BUILD === 'true';
const filepaths = process.env.CHANGED_FILE_PATHS.split(' ');
const pathsOfChangedFiles = filepaths.filter(filepath => {
  return (
    filepath !== 'package.json' &&
    filepath !== 'yarn.lock' &&
    filepath !== 'config/cross_app_import_graph.json' &&
    filepath !== 'script/github-actions/select-cypress-tests.js' &&
    filepath !== 'script/github-actions/create-cross-app-import-graph.js'
  );
});

function selectedTests() {
  const tests = [];
  const selectedApplications = [];
  const applicationNames = pathsOfChangedFiles
    .filter(filePath => !filePath.endsWith('.md'))
    .map(filePath => filePath.split('/')[2]);

  [...new Set(applicationNames)].forEach(appName => {
    selectedApplications.push(...graph[appName]);
  });

  [...new Set(selectedApplications)].forEach(appName => {
    const selectedTestsPattern = path.join(
      __dirname,
      '../..',
      'src/applications',
      `${appName}/**/tests/**/*.cypress.spec.js?(x)`,
    );

    tests.push(...glob.sync(selectedTestsPattern));
  });

  // Always run the tests in src/platform
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

let tests;

if (IS_MASTER_BUILD) {
  tests = allTests();
} else {
  let allMdFiles = true;
  let allMdOrSrcApplicationsFiles = true;

  for (let i = 0; i < pathsOfChangedFiles.length; i += 1) {
    if (!pathsOfChangedFiles[i].endsWith('.md')) {
      allMdFiles = false;
    }

    if (
      !pathsOfChangedFiles[i].endsWith('.md') &&
      !pathsOfChangedFiles[i].startsWith('src/applications')
    ) {
      allMdOrSrcApplicationsFiles = false;
    }

    if (allMdFiles === false && allMdOrSrcApplicationsFiles === false) {
      break;
    }
  }

  if (allMdFiles) {
    tests = [];
  } else if (allMdOrSrcApplicationsFiles) {
    tests = selectedTests();
  } else {
    tests = allTests();
  }
}

const numTests = tests.length;

// core.exportVariable() exports variable to GitHub Actions workflow
if (numTests === 0) {
  core.exportVariable('NUM_CONTAINERS', 0);
} else if (numTests <= 20) {
  core.exportVariable('NUM_CONTAINERS', 1);
  core.exportVariable('CI_NODE_INDEX', [0]);
} else if (numTests <= 40) {
  core.exportVariable('NUM_CONTAINERS', 2);
  core.exportVariable('CI_NODE_INDEX', [0, 1]);
} else if (numTests <= 60) {
  core.exportVariable('NUM_CONTAINERS', 3);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2]);
} else if (numTests <= 80) {
  core.exportVariable('NUM_CONTAINERS', 4);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3]);
} else if (numTests <= 100) {
  core.exportVariable('NUM_CONTAINERS', 5);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4]);
} else if (numTests <= 120) {
  core.exportVariable('NUM_CONTAINERS', 6);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5]);
} else if (numTests <= 140) {
  core.exportVariable('NUM_CONTAINERS', 7);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5, 6]);
} else {
  core.exportVariable('NUM_CONTAINERS', 8);
  core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5, 6, 7]);
}

if (numTests > 0) core.exportVariable('TESTS', tests);

return undefined;
