const core = require('@actions/core');

const sourceEvent = process.env.SOURCE_EVENT;
const sourceRef = process.env.SOURCE_REF;
const workflowRef = process.env.WORKFLOW_BRANCH;
/* eslint-disable no-console */

console.log(sourceEvent);
if (
  sourceEvent === 'repository_dispatch' ||
  sourceEvent === 'workflow_dispatch'
) {
  console.log('content');
  core.exportVariable('SOURCE_REPO', 'content-build');
  core.exportVariable('SOURCE_REF', sourceRef);
} else {
  console.log('vets');
  core.exportVariable('SOURCE_REPO', 'vets-website');
  core.exportVariable('SOURCE_REF', workflowRef);
}
