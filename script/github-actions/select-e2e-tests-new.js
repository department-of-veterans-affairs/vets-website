/* eslint-disable no-console */
const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const {
  e2e: { specPattern },
} = require('../../config/cypress.config');

const CHANGED_FILE_PATHS = process.env.CHANGED_FILE_PATHS
  ? process.env.CHANGED_FILE_PATHS.split(' ')
  : [];

// const CHANGED_FILE_PATHS = '.github/workflows/continuous-integration.yml script/check-cross-app-imports.js script/github-actions/select-e2e-tests-new.js src/applications/disability-benefits/2346/components/Accessories.jsx'.split(
//   ' ',
// );

const IS_CHANGED_APPS_BUILD = Boolean(process.env.APP_ENTRIES);
const RUN_FULL_SUITE = process.env.RUN_FULL_SUITE === 'true';
const APPS_HAVE_URLS = Boolean(process.env.APP_URLS);

const ALLOW_LIST =
  process.env.TEST_TYPE &&
  fs.existsSync(path.resolve(`${process.env.TEST_TYPE}_allow_list.json`))
    ? JSON.parse(
        fs.readFileSync(
          path.resolve(`${process.env.TEST_TYPE}_allow_list.json`),
        ),
      )
    : [];

function allTests() {
  const pattern = path.join(__dirname, '../..', specPattern);
  return glob.sync(pattern);
}

function selectTests(pathsOfChangedFiles) {
  console.log('selecting tests');

  const tests = [];
  if (RUN_FULL_SUITE) {
    console.log('all tests selected');
    tests.push(allTests());
  } else {
    const applicationNames = pathsOfChangedFiles
      .filter(
        filePath =>
          !filePath.endsWith('.md') &&
          !filePath.startsWith('.github/workflows'),
      )
      .map(filePath => filePath.split('/')[2]);
    [...new Set(applicationNames)].forEach(app => {
      console.log('app: ', app);
      const selectedTestsPattern = path.join(
        __dirname,
        '../..',
        'src/applications',
        `${app}/**/tests/**/*.cypress.spec.js?(x)`,
      );
      console.log('selectedTestsPattern: ', selectedTestsPattern);

      tests.push(...glob.sync(selectedTestsPattern));
    });

    console.log('tests: ', tests);
    if (IS_CHANGED_APPS_BUILD) {
      const megaMenuTestPath = path.join(
        __dirname,
        '../..',
        'src/platform/site-wide/mega-menu/tests/megaMenu.cypress.spec.js',
      );

      // Ensure changed apps have URLs to run header test on
      if (APPS_HAVE_URLS && fs.existsSync(megaMenuTestPath))
        tests.push(megaMenuTestPath);
    } else {
      const defaultTestsPattern = path.join(
        __dirname,
        '../..',
        'src/platform',
        '**/tests/**/*.cypress.spec.js?(x)',
      );

      tests.push(...glob.sync(defaultTestsPattern));
    }
  }

  return tests;
}

function exportVariables(tests) {
  const numTests = tests.length;

  if (numTests <= 30) {
    core.exportVariable('NUM_CONTAINERS', 4);
    core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3]);
  } else {
    core.exportVariable('NUM_CONTAINERS', 7);
    core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5, 6]);
  }
  core.exportVariable('TESTS', 'true');
  fs.writeFileSync(`e2e_tests_to_test.json`, JSON.stringify(tests));
}

function main() {
  const allAllowListSpecs = ALLOW_LIST.map(spec => spec.spec_path);

  // groups of tests from the allow list
  const allDisallowedTestPaths = ALLOW_LIST.filter(
    spec => spec.allowed === false,
  ).map(spec => spec.spec_path);

  const testsSelectedByTestSelection = selectTests(CHANGED_FILE_PATHS);

  const disallowedTests = testsSelectedByTestSelection.filter(test =>
    allDisallowedTestPaths.includes(test.substring(test.indexOf('src/'))),
  );

  const testsToRunNormally = testsSelectedByTestSelection.filter(
    test => !disallowedTests.includes(test),
  );

  const changedAppsForStressTest = CHANGED_FILE_PATHS
    ? CHANGED_FILE_PATHS.map(
        filePath =>
          filePath.startsWith('src/applications')
            ? filePath
                .split('/')
                .slice(0, 3)
                .join('/')
            : `${filePath
                .split('/')
                .slice(0, 3)
                .join('/')}/`,
      )
    : [];

  console.log('Changed Apps For Stress Test: ', changedAppsForStressTest);
  const existingTestsToStressTest = allAllowListSpecs.filter(specPath =>
    changedAppsForStressTest.some(
      filePath =>
        (!filePath.startsWith('src/applications') &&
          specPath.includes(filePath)) ||
        specPath.includes(`${filePath}/`),
    ),
  );

  const newTestsToStressTest = CHANGED_FILE_PATHS.filter(
    filePath =>
      filePath.includes('.cypress.spec.js') &&
      allAllowListSpecs.indexOf(path) === -1,
  );

  const testsToStressTest = existingTestsToStressTest
    .concat(newTestsToStressTest)
    .filter(testSpec => fs.existsSync(testSpec));

  exportVariables(testsToRunNormally);

  if (RUN_FULL_SUITE) {
    core.exportVariable('CYPRESS_TESTS_TO_STRESS_TEST', 'true');
    fs.writeFileSync(
      `e2e_tests_to_stress_test.json`,
      JSON.stringify(allAllowListSpecs),
    );
  } else if (testsToStressTest.length > 0) {
    core.exportVariable('CYPRESS_TESTS_TO_STRESS_TEST', 'true');
    fs.writeFileSync(
      `e2e_tests_to_stress_test.json`,
      JSON.stringify(testsToStressTest),
    );
  } else {
    core.exportVariable('CYPRESS_TESTS_TO_STRESS_TEST', 'false');
  }
}
// if (RUN_FULL_SUITE || ALLOW_LIST.length > 0) {
main();
// }
