const core = require('@actions/core');

const sourceEvent = process.env.SOURCE_EVENT;
const sourceRepo = process.env.SOURCE_REPO;
const sourceRef = process.env.SOURCE_BRANCH;
const workflowRef = process.env.WORKFLOW_BRANCH;

if (
  sourceEvent === 'repository_dispatch' ||
  sourceEvent === 'workflow_dispatch'
) {
  core.exportVariable('SOURCE_REPO', sourceRepo);
  core.exportVariable('SOURCE_REF', sourceRef);
} else {
  core.exportVariable('SOURCE_REPO', 'vets-api');
  core.exportVariable('SOURCE_REF', workflowRef);
}
