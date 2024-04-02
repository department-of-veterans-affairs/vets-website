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

const disallowedTests = ALLOW_LIST.filter(test => test.allowed === false).map(
  test => test.spec_path,
);
console.log(disallowedTests);

if (process.env.TEST_TYPE === 'e2e') {
  disallowedTests.push(
    'src/applications/check-in/pre-check-in/tests/e2e/routing/browser.back.button.cypress.spec.js',
  );

  if (disallowedTests.length > 0) {
    console.log('new disallowed tests: ', disallowedTests);

    const newTests = TESTS.filter(
      test =>
        !disallowedTests.some(disallowedTest => test.includes(disallowedTest)),
    );
    console.log(
      'tests index of disallowed spec:',
      TESTS.indexOf(
        TESTS.filter(test =>
          test.includes(
            'src/applications/pre-check-in/tests/e2e/errors/post-pre-check-in/non.200.status.code.cypress.spec.js',
          ),
        ),
      ),
    );
    console.log('new tests length:', newTests.length);
    console.log('new tests: ', newTests);

    core.exportVariable(TESTS_PROPERTY, newTests);
  }
}

if (process.env.TEST_TYPE === 'unit_test') {
  disallowedTests.push('src/applications/test-app/test-spec.unit.spec.js');
  core.exportVariable(TESTS_PROPERTY, disallowedTests);
}
