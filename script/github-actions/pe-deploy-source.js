const core = require('@actions/core');

const sourceEvent = process.env.SOURCE_EVENT;

/* eslint-disable no-console */
if (sourceEvent === 'repository_dispatch' || 'workflow_dispatch') {
  core.exportVariable('SOURCE_REPO', 'content-build');
} else {
  core.exportVariable('SOURCE_REPO', 'vets-website');
}
