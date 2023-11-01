const core = require('@actions/core');

const unitTestsBlockingMerge = process.env.UNIT_TESTS_BLOCKING_MERGE
  ? JSON.parse(process.env.UNIT_TESTS_BLOCKING_MERGE)
  : [];

const e2eTestsBlockingMerge = process.env.E2E_TESTS_BLOCKING_MERGE
  ? JSON.parse(process.env.E2E_TESTS_BLOCKING_MERGE)
  : [];

const testsBlockingMerge = e2eTestsBlockingMerge.concat(unitTestsBlockingMerge);

const errorMessages = [];

if (testsBlockingMerge.length > 0) {
  errorMessages.push(
    `*MERGE BLOCK WARNING* \n
    This PR has test specs that have been disabled to to flakiness. \n 
    Beginning on Nov 6th, 2023, merging will be blocked for PRs in products that have flaky Unit/E2E tests associated with them. Please resolve these tests BY 11/5/23 in order to avoid merge blocking.\n
    More information is available at: https://depo-platform-documentation.scrollhelp.site/developer-docs/test-stability-review.\n
    
    The file paths causing this status are: \n ${testsBlockingMerge.join(
      '\n',
    )}`,
  );
}

if (process.env.CYPRESS_TESTS_RESULT === 'failure') {
  errorMessages.push(
    `Your branch is unable to be merged due to Cypress test failures. Please check the Cypress Tests step for more information on which tests are not passing.`,
  );
}

if (errorMessages.length > 0) {
  core.setFailed(`- ${errorMessages.join('\n - ')}`);
}
