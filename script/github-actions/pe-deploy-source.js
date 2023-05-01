const core = require('@actions/core');

const sourceEvent = process.env.SOURCE_EVENT;
const sourceRepo = process.env.SOURCE_REPO;
const expirationDays = process.env.PE_EXPIRATION_DAYS;
const sourceRef = process.env.SOURCE_REF;
const sourceDeployment = process.env.SOURCE_DEPLOYMENT;
const workflowDeployment = process.env.WORKFLOW_DEPLOYMENT;

if (
  sourceEvent === 'repository_dispatch' ||
  sourceEvent === 'workflow_dispatch'
) {
  core.exportVariable('SOURCE_REPO', sourceRepo);
  core.exportVariable('EXPIRATION_DAYS', expirationDays);
  core.exportVariable('DEPLOYMENT_ID', sourceDeployment);
} else {
  core.exportVariable('SOURCE_REPO', 'vets-website');
  core.exportVariable('EXPIRATION_DAYS', '7');
  core.exportVariable('DEPLOYMENT_ID', workflowDeployment);
}

core.exportVariable(
  'SOURCE_REF_SANITIZED',
  sourceRef.replace(/[^a-zA-Z0-9-_]/g, ''),
);
