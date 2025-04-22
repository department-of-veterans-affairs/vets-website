/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const SHARED_DIRECTORIES = [
  'src/applications/shared',
  'src/applications/common',
];

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

const SHARED_CHANGED_APPS = CHANGED_APPS_UNIQUE.filter(appPath =>
  SHARED_DIRECTORIES.some(sharedDir => appPath.startsWith(sharedDir)),
);

const staticPagesTests = ALL_SPECS.filter(
  specPath =>
    specPath.toLowerCase().includes('static-pages') && fs.existsSync(specPath),
);

const allowedTestsForChangedApps = ALL_SPECS.filter(specPath => {
  return (
    SHARED_CHANGED_APPS.some(appPath => specPath.includes(appPath)) &&
    !DISALLOWED_SPECS.includes(specPath) &&
    fs.existsSync(specPath)
  );
});
const disallowedTestsForChangedApps = ALL_SPECS.filter(specPath => {
  return (
    SHARED_CHANGED_APPS.some(appPath => specPath.includes(appPath)) &&
    DISALLOWED_SPECS.includes(specPath) &&
    fs.existsSync(specPath)
  );
});

const finalAllowedTests = Array.from(
  new Set([...allowedTestsForChangedApps, ...staticPagesTests]),
);

core.exportVariable('DISALLOWED_TESTS', DISALLOWED_SPECS);

// ----- Output Logic -----
// If stress test mode is already enabled, output all existing specs:
if (IS_STRESS_TEST === 'true') {
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'true');
  core.exportVariable('APPS_TO_STRESS_TEST', ALL_APPS);
  const allExistingSpecs = ALL_SPECS.filter(specPath =>
    fs.existsSync(specPath),
  );
  fs.writeFileSync(
    'unit_tests_to_stress_test.json',
    JSON.stringify(allExistingSpecs),
  );
  // Else, if any disallowed tests exist for the changed shared apps, force stress test mode:
} else if (disallowedTestsForChangedApps.length > 0) {
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'true');
  core.exportVariable('APPS_TO_STRESS_TEST', SHARED_CHANGED_APPS);
  fs.writeFileSync(
    'unit_tests_to_stress_test.json',
    JSON.stringify(disallowedTestsForChangedApps),
  );
  // Else, if there are allowed tests for changed shared apps, run them normally:
} else if (finalAllowedTests.length > 0) {
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'false');
  core.exportVariable('APPS_TO_STRESS_TEST', SHARED_CHANGED_APPS);
  fs.writeFileSync('unit_tests_to_run.json', JSON.stringify(finalAllowedTests));
  // Otherwise, no tests are identified for changed shared apps:
} else {
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'false');
  core.exportVariable('APPS_TO_STRESS_TEST', SHARED_CHANGED_APPS);
  fs.writeFileSync('unit_tests_to_stress_test.json', '');
}
