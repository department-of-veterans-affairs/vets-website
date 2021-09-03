const core = require('@actions/core');
const path = require('path');
const glob = require('glob');
const { integrationFolder, testFiles } = require('../../config/cypress.json');
const graph = require('../../config/cross_app_import_graph.json');

const IS_MASTER_BUILD = process.env.IS_MASTER_BUILD === 'true';
const filepaths = process.env.CHANGED_FILE_PATHS.split(' ');
const pathsOfChangedFiles = filepaths.filter(filepath => {
  // Ignore the cross-app import graph file
  return filepath !== 'script/github-actions/create-cross-app-import-graph.js';
});

function selectedTests() {
  const tests = [];
  const applications = [];
  const applicationNames = pathsOfChangedFiles
    .filter(filePath => !filePath.endsWith('.md'))
    .map(filePath => filePath.split('/')[2]);

  [...new Set(applicationNames)].forEach(app => {
    // Lookup app in cross-app imports graph to reference which app's tests
    // should run
    applications.push(...graph[app].appsToTest);
  });

  [...new Set(applications)].forEach(app => {
    const selectedTestsPattern = path.join(
      __dirname,
      '../..',
      'src/applications',
      `${app}/**/tests/**/*.cypress.spec.js?(x)`,
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

function getTestBatch(tests, step, numContainers) {
  const divider = Math.ceil(tests.length / numContainers);

  // eslint-disable-next-line no-console
  console.log('tests', tests);

  return tests
    .map(test => test.replace('/home/runner/work', '/__w'))
    .slice(step * divider, (step + 1) * divider)
    .join(',');
}

function exportVariables(tests, ciNodeIndex, numContainers) {
  core.exportVariable('CI_NODE_INDEX', ciNodeIndex);
  core.exportVariable('NUM_CONTAINERS', numContainers);

  ciNodeIndex.forEach(step => {
    core.exportVariable(`BATCH_${step}`, true);
    core.exportVariable(
      `BATCH_${step}_TESTS`,
      getTestBatch(tests, step, numContainers),
    );
  });
}

let tests;

if (IS_MASTER_BUILD) {
  tests = allTests();
} else {
  let allMdFiles = true;
  let allMdAndOrSrcApplicationsFiles = true;

  for (let i = 0; i < pathsOfChangedFiles.length; i += 1) {
    if (!pathsOfChangedFiles[i].endsWith('.md')) {
      allMdFiles = false;
    }

    if (
      !pathsOfChangedFiles[i].endsWith('.md') &&
      !pathsOfChangedFiles[i].startsWith('src/applications')
    ) {
      allMdAndOrSrcApplicationsFiles = false;
    }

    if (allMdFiles === false && allMdAndOrSrcApplicationsFiles === false) {
      break;
    }
  }

  if (allMdFiles) {
    tests = [];
  } else if (allMdAndOrSrcApplicationsFiles) {
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
  const ciNodeIndex = [0];
  const numContainers = ciNodeIndex.length;
  exportVariables(tests, ciNodeIndex, numContainers);
} else if (numTests <= 40) {
  const ciNodeIndex = [0, 1];
  const numContainers = ciNodeIndex.length;
  exportVariables(tests, ciNodeIndex, numContainers);
} else if (numTests <= 60) {
  const ciNodeIndex = [0, 1, 2];
  const numContainers = ciNodeIndex.length;
  exportVariables(tests, ciNodeIndex, numContainers);
} else if (numTests <= 80) {
  const ciNodeIndex = [0, 1, 2, 3];
  const numContainers = ciNodeIndex.length;
  exportVariables(tests, ciNodeIndex, numContainers);
} else if (numTests <= 100) {
  const ciNodeIndex = [0, 1, 2, 3, 4];
  const numContainers = ciNodeIndex.length;
  exportVariables(tests, ciNodeIndex, numContainers);
} else if (numTests <= 120) {
  const ciNodeIndex = [0, 1, 2, 3, 4, 5];
  const numContainers = ciNodeIndex.length;
  exportVariables(tests, ciNodeIndex, numContainers);
} else if (numTests <= 140) {
  const ciNodeIndex = [0, 1, 2, 3, 4, 5, 6];
  const numContainers = ciNodeIndex.length;
  exportVariables(tests, ciNodeIndex, numContainers);
} else {
  const ciNodeIndex = [0, 1, 2, 3, 4, 5, 6, 7];
  const numContainers = ciNodeIndex.length;
  exportVariables(tests, ciNodeIndex, numContainers);
}

return undefined;
