/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const changedFilesEnv = process.env.CHANGED_FILES || '';
const CHANGED_FILES = changedFilesEnv
  .split(' ')
  .filter(
    file =>
      file &&
      file !== 'src/platform/utilities/feature-toggles/featureFlagNames.json',
  );

const ALLOW_LIST_PATH = path.resolve('unit_test_allow_list.json');
const ALLOW_LIST = fs.existsSync(ALLOW_LIST_PATH)
  ? JSON.parse(fs.readFileSync(ALLOW_LIST_PATH))
  : [];

const ALL_SPECS = ALLOW_LIST.map(spec => spec.spec_path);
const IS_STRESS_TEST = process.env.IS_STRESS_TEST || 'false';
const DISALLOWED_SPECS = ALLOW_LIST.filter(spec => spec.allowed === false).map(
  spec => spec.spec_path.substring(spec.spec_path.indexOf('src')),
);
const ALL_APPS = Array.from(
  new Set(
    ALL_SPECS.map(filePath =>
      filePath
        .split('/')
        .slice(0, 3)
        .join('/'),
    ),
  ),
);

const CHANGED_APPS = CHANGED_FILES.map(filePath =>
  filePath
    .split('/')
    .slice(0, 3)
    .join('/'),
);
const CHANGED_APPS_UNIQUE = Array.from(new Set(CHANGED_APPS));

const testsForChangedApps = ALL_SPECS.filter(specPath => {
  return (
    CHANGED_APPS_UNIQUE.some(appPath => specPath.includes(appPath)) &&
    fs.existsSync(specPath)
  );
});

const STATIC_PAGES_TESTS = ALL_SPECS.filter(
  specPath =>
    specPath.toLowerCase().includes('static-pages') && fs.existsSync(specPath),
);

const FINAL_TESTS = Array.from(
  new Set([...testsForChangedApps, ...STATIC_PAGES_TESTS]),
);

core.exportVariable('DISALLOWED_TESTS', DISALLOWED_SPECS);
if (IS_STRESS_TEST === 'true') {
  // Stress test mode: run all tests from the allow list that exist
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'true');
  core.exportVariable('APPS_TO_STRESS_TEST', ALL_APPS);
  const allExistingSpecs = ALL_SPECS.filter(specPath =>
    fs.existsSync(specPath),
  );
  fs.writeFileSync(
    'unit_tests_to_stress_test.json',
    JSON.stringify(allExistingSpecs),
  );
} else if (FINAL_TESTS.length > 0) {
  // Non-stress mode and there are tests (from changed apps or static pages) to run
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'true');
  core.exportVariable('APPS_TO_STRESS_TEST', CHANGED_APPS_UNIQUE);
  fs.writeFileSync(
    'unit_tests_to_stress_test.json',
    JSON.stringify(FINAL_TESTS),
  );
} else {
  // No tests were identified, so do not stress test
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'false');
  core.exportVariable('APPS_TO_STRESS_TEST', CHANGED_APPS_UNIQUE);
}
