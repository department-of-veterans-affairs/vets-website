/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');

const ALLOW_LIST = JSON.parse(process.env.ALLOW_LIST);
const CHANGED_FILE_PATHS = process.env.CHANGED_FILE_PATHS
  ? process.env.CHANGED_FILE_PATHS.split(' ')
  : [];

function getDaysSinceDate(diff) {
  if (!diff) {
    return 0;
  }
  const daysSinceDate =
    (new Date().getTime() - new Date(diff).getTime()) / (1000 * 3600 * 24);
  return daysSinceDate < 1
    ? Math.ceil(daysSinceDate)
    : Math.round(daysSinceDate);
}

// const allDisallowedTestsWithWarnings = ALLOW_LIST.filter(
//   spec =>
//     spec.allowed === false &&
//     spec.warned_at &&
//     getDaysSinceDate(spec.warned_at) > 60,
// ).map(spec => spec.spec_path);

const allDisallowedTestsWithWarnings = ALLOW_LIST.filter(
  spec =>
    spec.allowed === false &&
    spec.disallowed_at &&
    getDaysSinceDate(spec.disallowed_at) > 45,
);

console.log('all disallowed tests: ', allDisallowedTestsWithWarnings);

const appsAdjusted = CHANGED_FILE_PATHS.map(specPath =>
  specPath
    .split('/')
    .slice(specPath.indexOf('src'), 3)
    .join('/'),
);

console.log('apps adjusted: ', appsAdjusted);

const blockedPathsWithCodeChanges = allDisallowedTestsWithWarnings.filter(
  entry => appsAdjusted.some(appPath => entry.spec_path.includes(appPath)),
);
console.log('blocked paths with code changes: ', blockedPathsWithCodeChanges);

const warningsExistPastLimit = ALLOW_LIST.some(
  entry =>
    blockedPathsWithCodeChanges.indexOf(entry.spec_path) > -1 &&
    entry.allowed === false &&
    getDaysSinceDate(entry.disallowed_at > 60),
);

console.log('warningsExistPastLimit', warningsExistPastLimit);

if (blockedPathsWithCodeChanges.length > 0) {
  const annotationsJson = blockedPathsWithCodeChanges.map(spec => {
    const daysSinceWarned = getDaysSinceDate(spec.disallowed_at);
    return {
      path: spec.spec_path,
      start_line: 1,
      end_line: 1,
      title:
        daysSinceWarned > 60
          ? 'E2E Allow List Merge Blocked'
          : 'E2E Allow List Merge Block Warning',
      message:
        daysSinceWarned > 60
          ? 'Code in this PR is associated with this test spec which is currently blocking merges due to being disabled longer than 90 days. This test spec and/or its target code being tested must be corrected before code can be merged on this application.'
          : 'Code in this PR is associated with this test spec which is currently under a warning. If this warning is not cleared, merging will be blocked in the near future. See the E2E Allow List for full details',
      annotation_level: daysSinceWarned > 60 ? 'failure' : 'warning',
    };
  });
  console.log(annotationsJson);
  core.setOutput('annotations-json', JSON.stringify(annotationsJson));
} else {
  core.setOutput('annotations-json', JSON.stringify([]));
}

// For tomorrow - export array to output, pass array to new GHA job, create file in GHA job.
if (warningsExistPastLimit) {
  core.setFailed(
    `One or more directories contain tests that have been disabled for a total exceeding 90 days. In the future, merging will be blocked until all warnings are cleared. The paths in question are: ${blockedPathsWithCodeChanges}`,
  );
}
