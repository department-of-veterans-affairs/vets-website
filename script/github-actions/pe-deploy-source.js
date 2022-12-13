const core = require('@actions/core');

const sourceEvent = process.env.SOURCE_EVENT;
const sourceRef = process.env.SOURCE_REF;
const workflowRef = process.env.WORKFLOW_BRANCH;

if (
  sourceEvent === 'repository_dispatch' ||
  sourceEvent === 'workflow_dispatch'
) {
  core.exportVariable('SOURCE_REPO', 'content-build');
  core.exportVariable('SOURCE_REF', sourceRef);
} else {
  core.exportVariable('SOURCE_REPO', 'vets-website');
  core.exportVariable('SOURCE_REF', workflowRef);
}
