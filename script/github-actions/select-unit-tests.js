/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const CHANGED_FILES = process.env.CHANGED_FILES
  ? process.env.CHANGED_FILES.split(' ').filter(
      file =>
        file !== 'src/platform/utilities/feature-toggles/featureFlagNames.json',
    )
  : [];
const ALLOW_LIST = fs.existsSync(path.resolve(`unit_test_allow_list.json`))
  ? JSON.parse(fs.readFileSync(path.resolve(`unit_test_allow_list.json`)))
  : [];

const ALL_SPECS = ALLOW_LIST.map(spec => spec.spec_path);
const IS_STRESS_TEST = process.env.IS_STRESS_TEST || 'false';
const DISALLOWED_SPECS = ALLOW_LIST.filter(spec => spec.allowed === false).map(
  spec => spec.spec_path.substring(spec.spec_path.indexOf('src')),
);
const ALL_APPS = [
  ...new Set(
    ALL_SPECS.map(filePath =>
      filePath
        .split('/')
        .slice(0, 3)
        .join('/'),
    ),
  ),
];

const CHANGED_APPS =
  CHANGED_FILES.length > 0
    ? CHANGED_FILES.map(filePath =>
        filePath
          .split('/')
          .slice(0, 3)
          .join('/'),
      )
    : [];

const CHANGED_APPS_UNIQUE = [...new Set(CHANGED_APPS)];
const CHANGED_SPEC_FILES = CHANGED_FILES.filter(filePath =>
  /\.unit\.spec\.jsx?$/.test(filePath),
);
const DISALLOWED_SPECS_IN_CHANGED_APPS = DISALLOWED_SPECS.filter(
  specPath =>
    CHANGED_APPS_UNIQUE.some(appPath => specPath.includes(appPath)) &&
    fs.existsSync(specPath),
);

const TESTS_TO_STRESS_TEST = Array.from(
  new Set([
    // 1. Any spec file that was changed in this PR (new or modified)
    ...CHANGED_SPEC_FILES.filter(filePath => fs.existsSync(filePath)),
    // 2. Disallowed specs that belong to the changed apps
    ...DISALLOWED_SPECS_IN_CHANGED_APPS,
  ]),
);

core.exportVariable('DISALLOWED_TESTS', DISALLOWED_SPECS);
if (TESTS_TO_STRESS_TEST.length > 0 && IS_STRESS_TEST === 'false') {
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'true');
  core.exportVariable('APPS_TO_STRESS_TEST', CHANGED_APPS_UNIQUE);
  core.exportVariable('TESTS_RAN', 'true');
  fs.writeFileSync(
    `unit_tests_to_stress_test.json`,
    JSON.stringify(TESTS_TO_STRESS_TEST),
  );
} else if (IS_STRESS_TEST === 'true') {
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'true');
  core.exportVariable('APPS_TO_STRESS_TEST', ALL_APPS);
  core.exportVariable('TESTS_RAN', 'true');
  fs.writeFileSync(
    `unit_tests_to_stress_test.json`,
    JSON.stringify(ALL_SPECS.filter(specPath => fs.existsSync(specPath))),
  );
} else {
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'false');
  core.exportVariable('APPS_TO_STRESS_TEST', CHANGED_APPS_UNIQUE);
}
