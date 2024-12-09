/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');
// const fs = require('fs');
// const path = require('path');

const APPS_NOT_ISOLATED = process.env.APPS_NOT_ISOLATED
  ? JSON.parse(process.env.APPS_NOT_ISOLATED)
  : [];
const CHANGED_FILES = process.env.CHANGED_FILES
  ? process.env.CHANGED_FILES.split(' ')
  : [];

const matchingFiles = CHANGED_FILES.filter(filePath =>
  APPS_NOT_ISOLATED.some(app => filePath.includes(app)),
);

if (APPS_NOT_ISOLATED.length > 0) {
  const annotationsJson = matchingFiles.map(filePath => {
    return {
      path: filePath,
      start_line: 1,
      end_line: 1,
      title: `Staged Continuous Deployment App Isolation Conflict`,
      message: `*WARNING* This PR contains changes related to an application that is currently not isolated.
                \n As of Feb 3, 2025 deployment may no longer be possible for apps that are not isolated.
                \n Please isolate this app from other directories in 'src/applications' to prevent future deployment issues.
                \n More information on your app's status can be seen here: https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/frontend-support-dashboard/cross-app-import-report
                \n Please reach out to Frontend Platform Support with any questions.`,
      annotation_level: 'warning',
    };
  });

  core.exportVariable(
    `ISOLATION_ANNOTATIONS_JSON`,
    JSON.stringify(annotationsJson),
  );
} else {
  core.exportVariable(`ISOLATION_ANNOTATIONS_JSON`, JSON.stringify([]));
}
