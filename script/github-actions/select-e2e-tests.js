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

const ROOT_DIR = path.resolve(__dirname, '../..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// --- Cypress test discovery ---

function allCypressTests() {
  const pattern = path.join(ROOT_DIR, specPattern);
  return glob.sync(pattern);
}

function selectCypressTests(pathsOfChangedFiles) {
  const tests = [];

  // When RUN_FULL_SUITE is true, select all tests regardless of changed files
  if (RUN_FULL_SUITE) {
    tests.push(...allCypressTests());
    return tests;
  }

  const filteredChangedFiles = pathsOfChangedFiles.filter(
    filePath =>
      !filePath.endsWith('.md') && !filePath.startsWith('.github/workflows'),
  );
  if (filteredChangedFiles.length > 0) {
    const applicationNames = filteredChangedFiles.map(
      filePath => filePath.split('/')[2],
    );
    [...new Set(applicationNames)].forEach(app => {
      const selectedTestsPattern = path.join(
        ROOT_DIR,
        'src/applications',
        `${app}/**/tests/**/*.cypress.spec.js?(x)`,
      );
      console.log('selectedTestsPattern: ', selectedTestsPattern);

      tests.push(...glob.sync(selectedTestsPattern));
    });

    // Custom logic needed to ensure that changes to the array builder inside the
    // platform directory trigger the e2e specs that live in the simple forms app
    const ARRAY_BUILDER =
      'src/platform/forms-system/src/js/patterns/array-builder';
    if (filteredChangedFiles.some(p => p.includes(ARRAY_BUILDER))) {
      const neededSimpleFormsPattern = path.join(
        ROOT_DIR,
        'src/applications/simple-forms/mock-simple-forms-patterns',
        '**/tests/**/*.cypress.spec.js?(x)',
      );
      tests.push(...glob.sync(neededSimpleFormsPattern));
    }

    if (IS_CHANGED_APPS_BUILD) {
      const megaMenuTestPath = path.join(
        ROOT_DIR,
        'src/platform/site-wide/mega-menu/tests/megaMenu.cypress.spec.js',
      );

      // Ensure changed apps have URLs to run header test on
      if (APPS_HAVE_URLS && fs.existsSync(megaMenuTestPath))
        tests.push(megaMenuTestPath);
    } else {
      const defaultTestsPattern = path.join(
        ROOT_DIR,
        'src/platform',
        '**/tests/**/*.cypress.spec.js?(x)',
      );

      tests.push(...glob.sync(defaultTestsPattern));
    }
  }
  return tests;
}

// --- Playwright test discovery ---

function findPlaywrightFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') {
      // eslint-disable-next-line no-continue
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPlaywrightFiles(full));
    } else if (entry.name.endsWith('.playwright.spec.js')) {
      results.push(path.relative(ROOT_DIR, full));
    }
  }
  return results;
}

function selectPlaywrightTests(pathsOfChangedFiles) {
  const allFiles = findPlaywrightFiles(SRC_DIR);

  if (RUN_FULL_SUITE) {
    return allFiles;
  }

  if (pathsOfChangedFiles.length === 0) {
    return [];
  }

  const filteredChangedFiles = pathsOfChangedFiles.filter(
    filePath =>
      !filePath.endsWith('.md') && !filePath.startsWith('.github/workflows'),
  );

  if (filteredChangedFiles.length === 0) {
    return [];
  }

  // Playwright infrastructure or config changes → run all PW specs
  if (
    filteredChangedFiles.some(
      f =>
        f.startsWith('src/platform/testing/e2e/playwright') ||
        f.includes('playwright.config'),
    )
  ) {
    console.log(
      'Playwright infrastructure/config changed, running all Playwright tests.',
    );
    return allFiles;
  }

  const selected = new Set();

  // App-specific specs
  const changedApps = new Set();
  for (const filePath of filteredChangedFiles) {
    if (filePath.startsWith('src/applications/')) {
      changedApps.add(filePath.split('/')[2]);
    }
  }

  for (const app of changedApps) {
    const appDir = path.join(SRC_DIR, 'applications', app);
    if (fs.existsSync(appDir)) {
      for (const f of findPlaywrightFiles(appDir)) {
        selected.add(f);
      }
    }
  }

  // Platform changes → run platform PW specs
  const platformChanged = filteredChangedFiles.some(
    f =>
      f.startsWith('src/platform/') &&
      !f.startsWith('src/platform/testing/e2e/playwright'),
  );
  if (platformChanged) {
    for (const testFile of allFiles) {
      if (testFile.startsWith('src/platform/')) {
        selected.add(testFile);
      }
    }
  }

  console.log(
    `Playwright: Changed apps: ${[...changedApps].join(', ') || '(none)'}`,
  );
  console.log(`Playwright: Platform changed: ${platformChanged}`);
  console.log(
    `Playwright: Selected ${selected.size} of ${allFiles.length} specs.`,
  );

  return [...selected];
}

// --- Export functions ---

function exportCypressVariables(tests) {
  const numTests = tests.length;

  if (numTests <= 30) {
    core.exportVariable('NUM_CONTAINERS', 4);
    core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3]);
  } else {
    core.exportVariable('NUM_CONTAINERS', 7);
    core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5, 6]);
  }
  core.exportVariable('TESTS', numTests > 0 ? 'true' : 'false');
  fs.writeFileSync('e2e_tests_to_test.json', JSON.stringify(tests));
}

function exportPlaywrightVariables(tests) {
  core.exportVariable('PLAYWRIGHT_TESTS', tests.length > 0 ? 'true' : 'false');
  fs.writeFileSync('playwright_tests_to_test.json', JSON.stringify(tests));
  console.log(`Playwright tests selected: ${tests.length}`);
}

// --- Main ---

function main(selectedCypressTests) {
  let testsToRunNormally = selectedCypressTests;

  if (ALLOW_LIST.length > 0) {
    const allAllowListSpecs = ALLOW_LIST.map(spec => spec.spec_path);

    const allDisallowedTestPaths = ALLOW_LIST.filter(
      spec => spec.allowed === false,
    ).map(spec => spec.spec_path);

    const disallowedTests = selectedCypressTests.filter(test =>
      allDisallowedTestPaths.includes(test.substring(test.indexOf('src/'))),
    );

    testsToRunNormally = selectedCypressTests.filter(
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

    if (RUN_FULL_SUITE) {
      core.exportVariable('CYPRESS_TESTS_TO_STRESS_TEST', 'true');
      fs.writeFileSync(
        'e2e_tests_to_stress_test.json',
        JSON.stringify(allAllowListSpecs),
      );
    } else if (testsToStressTest.length > 0) {
      core.exportVariable('CYPRESS_TESTS_TO_STRESS_TEST', 'true');
      fs.writeFileSync(
        'e2e_tests_to_stress_test.json',
        JSON.stringify(testsToStressTest),
      );
    } else {
      core.exportVariable('CYPRESS_TESTS_TO_STRESS_TEST', 'false');
    }
  }

  exportCypressVariables(testsToRunNormally);
}

// Always select tests for both technologies
const selectedCypressTests = selectCypressTests(CHANGED_FILE_PATHS);
const selectedPlaywrightTests = selectPlaywrightTests(CHANGED_FILE_PATHS);

// Always export Playwright variables
exportPlaywrightVariables(selectedPlaywrightTests);

// Apply allow list filtering (Cypress only) when available
if (RUN_FULL_SUITE || ALLOW_LIST.length > 0) {
  main(selectedCypressTests);
} else {
  exportCypressVariables(selectedCypressTests);
}
