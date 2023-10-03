const core = require('@actions/core');

const testsBlockingMerge = process.env.TESTS_BLOCKING_MERGE
  ? JSON.parse(process.env.TESTS_BLOCKING_MERGE)
  : [];

if (testsBlockingMerge.length > 0) {
  core.setFailed(
    `This PR contains code to test specs that are disallowed for flakiness. Currently there is a grace period, beginning on October 4, to allow time for tests to be corrected. If not corrected by November 6, this application will be blocked from merging code changes. The file paths causing this status are: \n ${testsBlockingMerge.join(
      '\n',
    )}`,
  );
}
