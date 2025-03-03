/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');

const APPS_NOT_ISOLATED = process.env.APPS_NOT_ISOLATED
  ? JSON.parse(process.env.APPS_NOT_ISOLATED)
  : [];
const CHANGED_FILES = process.env.CHANGED_FILES
  ? process.env.CHANGED_FILES.split(' ')
  : [];

// Filter changed files for those related to non-isolated apps.
const matchingFiles = CHANGED_FILES.filter(filePath =>
  APPS_NOT_ISOLATED.some(app => filePath.includes(app)),
);

const nonStaticFiles = matchingFiles.filter(
  filePath => !filePath.includes('static-pages'),
);

if (APPS_NOT_ISOLATED.length > 0 && nonStaticFiles.length > 0) {
  const annotationsJson = nonStaticFiles.map(filePath => ({
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
  }));

  core.exportVariable(
    'ISOLATION_ANNOTATIONS_JSON',
    JSON.stringify(annotationsJson),
  );
  console.log(
    'Non-isolated app changes detected that are not related to static-pages.',
  );
  process.exit(1);
} else {
  core.exportVariable('ISOLATION_ANNOTATIONS_JSON', JSON.stringify([]));
  console.log(
    'No non-isolated app changes detected that are not related to static-pages.',
  );
}
