/* eslint-disable no-console */

// const core = require('@actions/core');

const E2E_BLOCKED_PATHS = JSON.parse(process.env.E2E_BLOCKED_PATHS);
const ALLOW_LIST = JSON.parse(process.env.ALLOW_LIST);

console.log('blocked paths', E2E_BLOCKED_PATHS);
console.log('allow list: ', ALLOW_LIST);

// const containsWarningsPastLimit = ALLOW_LIST.some(entry => entry.);
// if (E2E_BLOCKED_PATHS.length > 0) {
//   const specsBeingUpdated = E2E_BLOCKED_PATHS.map(spec => spec.split('/').pop);
//   const specsBeingStressTested = core.setFailed(
//     `One or more directories contain tests that have been disabled for a total exceeding 90 days. Merging is blocked until all warnings are cleared. The paths in question are: ${E2E_BLOCKED_PATHS}`,
//   );
//   process.exit(1);
// }
