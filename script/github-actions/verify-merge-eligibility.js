const core = require('@actions/core');

const testsBlockingMerge = process.env.TESTS_BLOCKING_MERGE
  ? JSON.parse(process.env.TESTS_BLOCKING_MERGE)
  : [];

if (testsBlockingMerge.length > 0) {
  core.setFailed(
    `*MERGE BLOCK WARNING* \n
    This PR has test specs that have been disabled to to flakiness. \n 
    Beginning on Nov 6th, 2023, merging will be blocked for PRs in products that have flaky Unit/E2E tests associated with them. Please resolve these tests BY 11/5/23 in order to avoid merge blocking.\n
    More information is available at: https://depo-platform-documentation.scrollhelp.site/developer-docs/test-stability-review.\n
    
    The file paths causing this status are: \n ${testsBlockingMerge.join(
      '\n',
    )}`,
  );
}
