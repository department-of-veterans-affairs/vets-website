/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

const mergeCheckType = (function() {
  switch (process.env.TEST_TYPE) {
    case 'unit_test':
      return 'Unit Test';
    case 'e2e':
      return 'E2E';
    default:
      return 'E2E';
  }
})();
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

if (TESTS_BLOCKING_MERGE.length > 0) {
  const annotationsJson = TESTS_BLOCKING_MERGE.map(spec => {
    return {
      path: spec,
      start_line: 1,
      end_line: 1,
      title: `${mergeCheckType} Allow List Merge Block Warning`,
      message: `*MERGE BLOCK WARNING* This PR contains changes related to this test spec which has been disabled for flakiness.
                \n Beginning on Nov 6th, 2023, merging will be blocked for PRs in products that have flaky Unit/E2E tests associated with them.
                \n Please resolve these tests BY 11/5/23 in order to avoid merge blocking.
                \n More information is available at: https://depo-platform-documentation.scrollhelp.site/developer-docs/test-stability-review.`,
      annotation_level: 'warning',
    };
  });
  core.exportVariable(
    `${process.env.TEST_TYPE.toUpperCase()}_ANNOTATIONS_JSON`,
    JSON.stringify(annotationsJson),
  );
  core.exportVariable('TESTS_BLOCKING_MERGE', TESTS_BLOCKING_MERGE);
} else {
  core.exportVariable(
    `${process.env.TEST_TYPE.toUpperCase()}_ANNOTATIONS_JSON`,
    JSON.stringify([]),
  );
}
