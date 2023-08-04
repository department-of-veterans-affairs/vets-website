/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');

const E2E_BLOCKED_PATHS = JSON.parse(process.env.E2E_BLOCKED_PATHS);
const ALLOW_LIST = JSON.parse(process.env.ALLOW_LIST);

const warningsExistPastLimit = ALLOW_LIST.some(
  entry =>
    E2E_BLOCKED_PATHS.indexOf(entry.spec_path) > -1 && entry.allowed === false,
);

if (warningsExistPastLimit) {
  core.setFailed(
    `One or more directories contain tests that have been disabled for a total exceeding 90 days. In the future, merging will be blocked until all warnings are cleared. The paths in question are: ${E2E_BLOCKED_PATHS}`,
  );
  process.exit(1);
}
