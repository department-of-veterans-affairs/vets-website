const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const CHANGED_FILES = process.env.CHANGED_FILES || [];
const ALLOW_LIST = fs.existsSync(path.resolve(`unit_test_allow_list.json`))
  ? JSON.parse(fs.readFileSync(path.resolve(`unit_test_allow_list.json`)))
  : [];

const ALL_SPECS = ALLOW_LIST.map(spec => spec.spec_path);

const DISALLOWED_SPECS = ALLOW_LIST.filter(spec => spec.allowed === false).map(
  spec => spec.spec_path.substring(spec.spec_path.indexOf('src')),
);

const CHANGED_APPS =
  CHANGED_FILES.length > 0
    ? CHANGED_FILES.split(' ').map(filePath =>
        filePath
          .split('/')
          .slice(0, 3)
          .join('/'),
      )
    : [];

const CHANGED_APPS_UNIQUE = [...new Set(CHANGED_APPS)];

const TESTS_TO_STRESS_TEST = ALL_SPECS.filter(
  specPath =>
    CHANGED_APPS_UNIQUE.some(filePath => specPath.includes(filePath)) &&
    fs.existsSync(specPath),
);

core.exportVariable('APPS_TO_STRESS_TEST', CHANGED_APPS_UNIQUE);
core.exportVariable('DISALLOWED_TESTS', DISALLOWED_SPECS);
if (TESTS_TO_STRESS_TEST.length > 0) {
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'true');
  fs.writeFileSync(
    `unit_tests_to_stress_test.json`,
    JSON.stringify(TESTS_TO_STRESS_TEST),
  );
} else {
  core.exportVariable('UNIT_TESTS_TO_STRESS_TEST', 'false');
}
