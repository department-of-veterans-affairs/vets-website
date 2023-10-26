const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const ALLOW_LIST = fs.existsSync(path.resolve(`unit_test_allow_list.json`))
  ? JSON.parse(fs.readFileSync(path.resolve(`unit_test_allow_list.json`)))
  : [];

const ALL_SPECS = ALLOW_LIST.map(spec => spec.spec_path);

const DISALLOWED_SPECS = ALLOW_LIST.filter(spec => spec.allowed === false).map(
  spec => spec.spec_path.substring(spec.spec_path.indexOf('src')),
);

const CHANGED_APPS = process.env.CHANGED_FILES
  ? process.env.CHANGED_FILES.split(' ').map(filePath =>
      filePath
        .split('/')
        .slice(0, 3)
        .join('/'),
    )
  : [];

const TESTS_TO_STRESS_TEST = ALL_SPECS.filter(
  specPath =>
    CHANGED_APPS.some(filePath => specPath.includes(filePath)) &&
    fs.existsSync(specPath),
);

core.exportVariable('TESTS_TO_STRESS_TEST', TESTS_TO_STRESS_TEST);
core.exportVariable('DISALLOWED_TESTS', DISALLOWED_SPECS);
