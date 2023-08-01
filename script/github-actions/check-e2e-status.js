const core = require('@actions/core');

const TESTS_TO_STRESS_TEST = JSON.parse(process.env.TESTS_TO_STRESS_TEST);
const E2E_BLOCKED_PATHS = JSON.parse(process.env.E2E_BLOCKED_PATHS);

if (E2E_BLOCKED_PATHS.length > 0 && TESTS_TO_STRESS_TEST.length === 0) {
  core.setFailed(
    `One or more directories contain tests that have been disabled for a total exceeding 90 days. Merging is blocked until all warnings are cleared. The paths in question are: ${E2E_BLOCKED_PATHS}`,
  );
  process.exit(1);
}
