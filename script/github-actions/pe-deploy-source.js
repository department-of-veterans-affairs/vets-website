const core = require('@actions/core');

const sourceEvent = process.env.SOURCE_EVENT;
const sourceRepo = process.env.SOURCE_REPO;
const sourceRef = process.env.SOURCE_REF;
const sourceDeployment = process.env.SOURCE_DEPLOYMENT;
const workflowDeployment = process.env.WORKFLOW_DEPLOYMENT;

if (
  sourceEvent === 'repository_dispatch' ||
  sourceEvent === 'workflow_dispatch'
) {
  core.exportVariable('SOURCE_REPO', sourceRepo);

  core.exportVariable('DEPLOYMENT_ID', sourceDeployment);
} else {
  core.exportVariable('SOURCE_REPO', 'vets-website');
  core.exportVariable('DEPLOYMENT_ID', workflowDeployment);
}

core.exportVariable(
  'SOURCE_REF_SANITIZED',
  sourceRef.replace(/[^a-zA-Z0-9-_]/g, ''),
);
