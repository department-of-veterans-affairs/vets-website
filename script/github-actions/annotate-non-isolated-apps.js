/* eslint-disable no-console */
/* eslint-disable camelcase */

// const core = require('@actions/core');
// const fs = require('fs');
// const path = require('path');

const APPS_NOT_ISOLATED = process.env.APPS_NOT_ISOLATED
  ? JSON.parse(process.env.APPS_NOT_ISOLATED)
  : [];
const CHANGED_FILES = process.env.CHANGED_FILES
  ? process.env.CHANGED_FILES.split(' ').map(filePath =>
      filePath
        .split('/')
        .slice(0, 3)
        .join('/'),
    )
  : [];
console.log('apps not isolated: ', APPS_NOT_ISOLATED);
console.log('changed apps: ', CHANGED_FILES);

const matchingApps = APPS_NOT_ISOLATED.filter(app =>
  CHANGED_FILES.some(filePath => filePath.includes(app)),
);

const matchingFiles = CHANGED_FILES.filter(filePath =>
  APPS_NOT_ISOLATED.some(app => filePath.includes(app)),
);

// if (matchingApps && matchingApps.length > 0) {
// }

console.log('apps not isolated being updated: ', matchingApps);
console.log('files belonging to apps not isolated: ', matchingFiles);

// if (APPS_NOT_ISOLATED.length > 0) {
//   const annotationsJson = TESTS_BLOCKING_MERGE.map(spec => {
//     return {
//       path: spec,
//       start_line: 1,
//       end_line: 1,
//       title: `${mergeCheckType} Test Stability Allow List Merge Blocked`,
//       message: `*MERGE BLOCK NOTICE* This PR contains changes related to this test spec which has been disabled for flakiness.
//                 \n As of Nov 6th, 2023, merging is blocked for PRs in products that have flaky Unit/E2E tests associated with them.
//                 \n Please resolve these tests to remove this blocker.
//                 \n More information is available at: https://depo-platform-documentation.scrollhelp.site/developer-docs/test-stability-review`,
//       annotation_level: 'failure',
//     };
//   });
//   core.exportVariable(
//     `ISOLATION_ANNOTATIONS_JSON`,
//     JSON.stringify(annotationsJson),
//   );
// } else {
//   core.exportVariable(`ISOLATION_ANNOTATIONS_JSON`, JSON.stringify([]));
// }
