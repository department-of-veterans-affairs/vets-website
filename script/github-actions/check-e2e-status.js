/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');
const fs = require('fs');

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
    getDaysSinceDate(spec.disallowed_at) > 60,
).map(spec => spec.spec_path);

const appsAdjusted = CHANGED_FILE_PATHS.map(specPath =>
  specPath
    .split('/')
    .slice(specPath.indexOf('src'), 3)
    .join('/'),
);

const blockedPathsWithCodeChanges = allDisallowedTestsWithWarnings.filter(
  entry => appsAdjusted.some(appPath => entry.includes(appPath)),
);
console.log(blockedPathsWithCodeChanges);

const warningsExistPastLimit = ALLOW_LIST.some(
  entry =>
    blockedPathsWithCodeChanges.indexOf(entry.spec_path) > -1 &&
    entry.allowed === false,
);

if (blockedPathsWithCodeChanges.length > 0) {
  const annotationsJson = allDisallowedTestsWithWarnings.map(spec => {
    return {
      path: spec.spec_path,
      start_line: 1,
      end_line: 1,
      title: 'E2E Allow List Merge Block Warning',
      message:
        warningsExistPastLimit.length > 0
          ? 'Code in this PR is associated with this test spec which is currently blocking merges due to being disabled longer than 90 days. This test spec and/or its target code being tested must be corrected before code can be merged on this application.'
          : 'Code in this PR is associated with this test spec which is currently under a warning. If this warning is not cleared, merging will be blocked in the near future. See the E2E Allow List for full details',
      annotation_level:
        warningsExistPastLimit.length > 0 ? 'failure' : 'warning',
    };
  });
  fs.writeFileSync('annotations.json', JSON.stringify(annotationsJson));
  core.exportVariable('ANNOTATIONS_EXIST', true);
} else {
  core.exportVariable('ANNOTATIONS_EXIST', false);
}

// if (warningsExistPastLimit) {
//   core.setFailed(
//     `One or more directories contain tests that have been disabled for a total exceeding 90 days. In the future, merging will be blocked until all warnings are cleared. The paths in question are: ${blockedPathsWithCodeChanges}`,
//   );
//   process.exit(1);
// }
