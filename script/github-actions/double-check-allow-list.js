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

console.log('TESTS', TESTS);
console.log('TESTS_PROPERTY', TESTS_PROPERTY);

const disallowedTests = ALLOW_LIST.filter(test => test.allowed === false).map(
  test => test.spec_path,
);
console.log(disallowedTests);

if (process.env.TEST_TYPE === 'e2e') {
  console.log('e2e tests');
  const newDisallowedTests = disallowedTests.filter(test =>
    TESTS.includes(test),
  );

  newDisallowedTests.push(
    'src/applications/pre-check-in/tests/e2e/errors/post-pre-check-in/non.200.status.code.cypress.spec.js',
  );

  if (newDisallowedTests.length > 0) {
    console.log('new disallowed tests: ', newDisallowedTests);

    const newTests = TESTS.filter(test => disallowedTests.indexOf(test) === -1);

    console.log('new tests: ', newTests);

    core.exportVariable(TESTS_PROPERTY, newTests);
  }
}

if (process.env.TEST_TYPE === 'unit_test') {
  disallowedTests.push('src/applications/test-app/test-spec.unit.spec.js');
  core.exportVariable(TESTS_PROPERTY, disallowedTests);
}
