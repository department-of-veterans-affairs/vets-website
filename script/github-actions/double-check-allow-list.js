/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const TESTS_LIST = fs.existsSync(
  path.resolve(`${process.env.TEST_TYPE}_tests_to_test.json`),
)
  ? JSON.parse(
      fs.readFileSync(
        path.resolve(`${process.env.TEST_TYPE}_tests_to_test.json`),
      ),
    )
  : null;
let TESTS = [];
if (TESTS_LIST) {
  TESTS = TESTS_LIST.map(test => test.slice(test.indexOf('src')));
}
const TESTS_PROPERTY = process.env.TEST_PROPERTY || 'TESTS';

const ALLOW_LIST =
  process.env.TEST_TYPE &&
  fs.existsSync(
    path.resolve(
      `qa-standards-dashboard-data/${process.env.TEST_TYPE}_allow_list.json`,
    ),
  )
    ? JSON.parse(
        fs.readFileSync(
          path.resolve(
            `qa-standards-dashboard-data/${
              process.env.TEST_TYPE
            }_allow_list.json`,
          ),
        ),
      )
    : [];

const disallowedTests = ALLOW_LIST.filter(test => test.allowed === false).map(
  test => test.spec_path,
);

if (process.env.TEST_TYPE === 'e2e' && disallowedTests.length > 0) {
  const newTests = TESTS.filter(
    test =>
      !disallowedTests.some(disallowedTest => test.includes(disallowedTest)),
  );
  fs.writeFileSync(`e2e_tests_to_test.json`, JSON.stringify(newTests));
}

if (process.env.TEST_TYPE === 'unit_test') {
  core.exportVariable(TESTS_PROPERTY, disallowedTests);
}
