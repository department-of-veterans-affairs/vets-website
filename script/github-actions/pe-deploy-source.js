const core = require('@actions/core');

const sourceEvent = process.env.SOURCE_EVENT;

/* eslint-disable no-console */

console.log(sourceEvent);
if (sourceEvent === 'repository_dispatch' || 'workflow_dispatch') {
  console.log('content');
  core.exportVariable('SOURCE_REPO', 'content-build');
} else {
  console.log('vets');
  core.exportVariable('SOURCE_REPO', 'vets-website');
}
