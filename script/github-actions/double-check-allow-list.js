/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const TESTS =
  JSON.parse(process.env.TESTS).map(test => test.slice(test.indexOf('src'))) ||
  [];
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
  core.exportVariable(TESTS_PROPERTY, newTests);
}

if (process.env.TEST_TYPE === 'unit_test') {
  core.exportVariable(TESTS_PROPERTY, disallowedTests);
}
