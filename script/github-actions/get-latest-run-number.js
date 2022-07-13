/* eslint-disable no-console */
/* eslint-disable camelcase */

const { Octokit } = require('@octokit/rest');

const { GITHUB_TOKEN: auth, GITHUB_REPOSITORY } = process.env;
const [owner, repo] = GITHUB_REPOSITORY.split('/');

const octokit = new Octokit({ auth });

const params = {
  owner,
  repo,
  workflow_id: 'continuous-integration.yml',
  branch: 'main',
};

return octokit.rest.actions
  .listWorkflowRuns(params)
  .then(response => {
    if (response.status !== 200) {
      throw new Error(
        `Response ${response.status} from ${response.url}. Aborting.`,
      );
    }
    return response.data;
  })
  .then(({ workflow_runs }) => {
    if (workflow_runs.length === 0) {
      throw new Error('No workflows found. Aborting.');
    }

    console.log(workflow_runs[0].run_number);
  });
