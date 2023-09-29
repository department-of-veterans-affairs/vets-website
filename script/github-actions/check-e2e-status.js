/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

const mergeCheckType = function() {
  switch (process.env.TEST_TYPE) {
    case 'unit_test':
      return 'Unit Test';
    case 'e2e':
      return 'E2E';
    default:
      return 'E2E';
  }
};
const ALLOW_LIST = JSON.parse(
  fs.readFileSync(path.resolve(`${process.env.TEST_TYPE}_allow_list.json`)),
);
const CHANGED_APPS = process.env.CHANGED_FILES
  ? process.env.CHANGED_FILES.split(' ').map(filePath =>
      filePath
        .split('/')
        .slice(0, 3)
        .join('/'),
    )
  : [];
const DISALLOWED_SPECS = ALLOW_LIST.filter(
  spec => spec.allowed === false,
).map(spec => spec.spec_path.substring(spec.spec_path.indexOf('src')));

const TESTS_BLOCKING_MERGE = DISALLOWED_SPECS.filter(specPath =>
  CHANGED_APPS.some(filePath => specPath.includes(filePath)),
);

console.log(CHANGED_APPS);
console.log(DISALLOWED_SPECS);
console.log(TESTS_BLOCKING_MERGE);

if (TESTS_BLOCKING_MERGE.length > 0) {
  const annotationsJson = TESTS_BLOCKING_MERGE.map(spec => {
    return {
      path: spec,
      start_line: 1,
      end_line: 1,
      title: `${mergeCheckType} Allow List Merge Block Warning`,
      message:
        'This spec is currently disallowed from running due to flakiness. Currently there is a grace period, beginning on October 4, to allow time for tests to be corrected. If not corrected by November 6, this application will be blocked from merging code changes.',
      annotation_level: 'warning',
    };
  });
  core.exportVariable(
    `${process.env.TEST_TYPE.toUpperCase()}_ANNOTATIONS_JSON`,
    JSON.stringify(annotationsJson),
  );
  // core.setFailed(
  //   `This PR contains code to test specs that are disallowed for flakiness. Currently there is a grace period, beginning on October 4, to allow time for tests to be corrected. If not corrected by November 6, this application will be blocked from merging code changes. The file paths causing this status are: \n ${TESTS_BLOCKING_MERGE.join(
  //     '\n',
  //   )}`,
  // );
} else {
  core.exportVariable(
    `${process.env.TEST_TYPE.toUpperCase()}_ANNOTATIONS_JSON`,
    JSON.stringify([]),
  );
}

// function getDaysSinceDate(diff) {
//   if (!diff) {
//     return 0;
//   }
//   const daysSinceDate =
//     (new Date().getTime() - new Date(diff).getTime()) / (1000 * 3600 * 24);
//   return daysSinceDate < 1
//     ? Math.ceil(daysSinceDate)
//     : Math.round(daysSinceDate);
// }

// const allDisallowedTestsWithWarnings = ALLOW_LIST.filter(
//   spec =>
//     spec.allowed === false &&
//     spec.warned_at &&
//     getDaysSinceDate(spec.warned_at) > 60,
// ).map(spec => spec.spec_path);

// const appsAdjusted = CHANGED_FILE_PATHS.map(specPath =>
//   specPath
//     .split('/')
//     .slice(specPath.indexOf('src'), 3)
//     .join('/'),
// );

// const blockedPathsWithCodeChanges = allDisallowedTestsWithWarnings.filter(
//   entry => appsAdjusted.some(appPath => entry.includes(appPath)),
// );

// const warningsExistPastLimit = ALLOW_LIST.some(
//   entry =>
//     blockedPathsWithCodeChanges.indexOf(entry.spec_path) > -1 &&
//     entry.allowed === false,
// );

// if (warningsExistPastLimit) {
//   core.setFailed(
//     `One or more directories contain tests that have been disabled for a total exceeding 90 days. In the future, merging will be blocked until all warnings are cleared. The paths in question are: ${blockedPathsWithCodeChanges}`,
//   );
//   process.exit(1);
// }
