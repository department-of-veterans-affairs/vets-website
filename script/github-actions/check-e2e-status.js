/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');

const ALLOW_LIST = JSON.parse(process.env.ALLOW_LIST);
const CHANGED_FILE_PATHS = process.env.CHANGED_FILE_PATHS
  ? process.env.CHANGED_FILE_PATHS.split(' ')
  : [];
console.log('CHANGED_FILE_PATHS', CHANGED_FILE_PATHS);

function getDaysSinceDate(diff) {
  const daysSinceDate =
    (new Date().getTime() - new Date(diff).getTime()) / (1000 * 3600 * 24);
  return daysSinceDate < 1
    ? Math.ceil(daysSinceDate)
    : Math.round(daysSinceDate);
}

const allDisallowedTestsWithWarnings = ALLOW_LIST.filter(
  spec => spec.allowed === false && getDaysSinceDate(spec.warned_at) > 60,
).map(spec => spec.spec_path);
console.log('allDisallowedTestsWithWarnings', allDisallowedTestsWithWarnings);

const appsAdjusted = CHANGED_FILE_PATHS.map(specPath =>
  specPath
    .split('/')
    .slice(specPath.indexOf('src'), 3)
    .join('/'),
);
console.log('appsAdjusted', appsAdjusted);

const blockedPathsWithCodeChanges = allDisallowedTestsWithWarnings.filter(
  entry => appsAdjusted.some(appPath => entry.includes(appPath)),
);
console.log('blockedPathsWithCodeCHanges', blockedPathsWithCodeChanges);

const warningsExistPastLimit = ALLOW_LIST.some(
  entry =>
    blockedPathsWithCodeChanges.indexOf(entry.spec_path) > -1 &&
    entry.allowed === false,
);
console.log('warningsExistPastLimit', warningsExistPastLimit);

if (warningsExistPastLimit) {
  core.setFailed(
    `One or more directories contain tests that have been disabled for a total exceeding 90 days. In the future, merging will be blocked until all warnings are cleared. The paths in question are: ${blockedPathsWithCodeChanges}`,
  );
  process.exit(1);
}
