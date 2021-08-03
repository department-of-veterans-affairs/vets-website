const path = require('path');
const glob = require('glob');
const { runCommandSync } = require('../utils');
const { integrationFolder, testFiles } = require('../../config/cypress.json');

// eslint-disable-next-line no-console
console.log('Changed files: ', process.env.CHANGED_FILE_PATHS);
const pathsOfChangedFiles = process.env.CHANGED_FILE_PATHS.split('\n');
// eslint-disable-next-line no-console
console.log('pathsOfChangedFiles: ', pathsOfChangedFiles);

// let batch;

// function allPathsEndWith(str) {
//   for (let i = 0; i < pathsOfChangedFiles.length; i += 1) {
//     if (!pathsOfChangedFiles.endsWith(str)) return false;
//   }

//   return true;
// }

// function allPathsStartWith(str) {
//   for (let i = 0; i < pathsOfChangedFiles.length; i += 1) {
//     if (!pathsOfChangedFiles.startsWith(str)) return false;
//   }

//   return true;
// }

// function selectedTests() {}

function allTests() {
  const pattern = path.join(__dirname, '../..', integrationFolder, testFiles);
  const tests = glob.sync(pattern);
  const divider = Math.ceil(tests.length / 8);

  return tests
    .slice(
      Number(process.env.STEP) * divider,
      (Number(process.env.STEP) + 1) * divider,
    )
    .join(',');
}

// if (allPathsEndWith('.md')) {
//   batch = '';
// } else if (allPathsStartWith('/src/applications')) {
//   batch = selectedTests();
// } else {
//   batch = allTests();
// }

const status = runCommandSync(
  `yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec '${allTests()}'`,
);

process.exit(status);
