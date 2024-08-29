/* eslint-disable no-console */
/* eslint-disable camelcase */
const path = require('path');
const fetch = require('node-fetch');
const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');
const { runCommandSync, sleep } = require('../utils');

const BUCKETS = require('../../src/site/constants/buckets');
const ENVIRONMENTS = require('../../src/site/constants/environments');

const {
  GITHUB_TOKEN: auth,
  GITHUB_REPOSITORY,
  GITHUB_SHA,
  GITHUB_RUN_NUMBER,
} = process.env;

const octokit = new Octokit({ auth });

/**
 * Gets the in progress workflow runs of a specified workflow.
 *
 * @param {string} workflow_id - Workflow id or file name
 * @returns {Array} List of in progress workflow runs.
 */
const getInProgressWorkflowRuns = workflow_id => {
  const [owner, repo] = GITHUB_REPOSITORY.split('/');

  const params = {
    owner,
    repo,
    workflow_id,
    branch: 'main',
    status: 'in_progress',
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
      return workflow_runs;
    });
};

/**
 * Gets the commit hash of the last full deploy of an environment.
 *
 * @param {string} env - Name of environment
 * @returns {string} Commit hash of the latest full deploy.
 */
const getLastFullDeployCommit = async env => {
  console.log(env);
  const envBucketUrl = BUCKETS[env];
  const buildTextUrl = new URL(path.join(envBucketUrl, 'BUILD.txt'));

  const response = await fetch(buildTextUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${buildTextUrl}.\n${response.statusText}`);
  }

  const buildTextFile = await response.text();
  const lines = buildTextFile.split('\n').filter(Boolean);

  return lines[6]?.slice(4);
};

/**
 * Checks whether the first commit is an ancestor of the second commit.
 *
 * @param {string} commitA - Possible ancestor's commit hash
 * @param {string} commitB - Possible descendant's commit hash
 * @returns {Boolean} Returns true if the first commit is an ancestor of the second.
 */
const isAncestor = (commitA, commitB) => {
  const exitCode = runCommandSync(
    `git merge-base --is-ancestor ${commitA} ${commitB}`,
  );

  if (![0, 1].includes(exitCode)) {
    throw new Error(
      `'git merge-base --is-ancestor' exited with an unsuccessful code (${exitCode}).`,
    );
  }

  return commitA !== commitB && exitCode === 0;
};

/**
 * Checks if the given commit sha is ahead of the last full deploy of an environment.
 *
 * @param {string} commitSha - Commit sha
 * @param {string} env - Environment name
 * @returns {Boolean} Returns true if the commit is ahead of the last full deploy.
 */
const isAheadOfLastFullDeploy = async (commitSha, env) => {
  const lastFullDeployCommitSha = await getLastFullDeployCommit(env);
  return isAncestor(lastFullDeployCommitSha, commitSha);
};

/**
 * Determines if the given commit sha can be deployed to non production environments.
 *
 * @param {string} commitSha - Commit sha
 * @param {number} runNumber - Run number of the workflow run
 * @param {string} env - Environment name
 * @returns {Boolean} Whether or not the commit can be deployed to the environment.
 */
const isDeployableToEnv = async (commitSha, runNumber, env) => {
  const TIMEOUT = 5; // Number of minutes to wait before checking again
  const isNewerCommit = await isAheadOfLastFullDeploy(commitSha, env);

  if (!isNewerCommit) {
    console.log(
      `Commit is older than the last full deploy of ${env}. Skipping deploy.`,
    );
    return false;
  }

  const inProgressWorkflowRuns = await getInProgressWorkflowRuns(
    'continuous-integration.yml',
  );
  if (inProgressWorkflowRuns.length === 1) return true;

  const previousCommitsInProgress = inProgressWorkflowRuns.find(
    workflowRun => workflowRun.run_number < runNumber,
  );

  if (!previousCommitsInProgress) return true;

  console.log('Waiting for previous workflow runs to finish deploying...');
  await sleep(TIMEOUT * 60 * 1000);

  return isDeployableToEnv(commitSha, runNumber, env);
};

/**
 * Determines if the given commit sha can be deployed to production. This is
 * intended to be used for isolated app commits in the `main` branch
 * to avoid a race condition with the daily production deploy.
 *
 * @param {string} commitSha - Commit sha
 * @returns {Boolean} Whether or not the commit can be deployed to production.
 */
const isDeployableToProd = async commitSha => {
  const TIMEOUT = 10; // Number of minutes to wait before checking again
  const isNewerCommit = await isAheadOfLastFullDeploy(
    commitSha,
    ENVIRONMENTS.VAGOVPROD,
  );

  if (!isNewerCommit) {
    console.log(
      `Commit is older than the last full deploy of ${
        ENVIRONMENTS.VAGOVPROD
      }. Skipping isolated app deploy.`,
    );
    return false;
  }

  const inProgressWorkflowRuns = await getInProgressWorkflowRuns(
    'daily-deploy-production.yml',
  );
  if (inProgressWorkflowRuns.length === 0) return true;

  // Get the first item in the Array. Since workflow runs for the daily production
  // deploy aren't concurrent, there should be only one deploy happening at a time.
  const dailyDeploySha = inProgressWorkflowRuns[0].head_sha;

  // Don't deploy isolated app commits that are older than the daily deploy
  // commit. The daily deploy will include the changes from the older commit.
  const isAheadOfDailyDeploy = isAncestor(dailyDeploySha, commitSha);

  if (!isAheadOfDailyDeploy) {
    console.log(
      `Daily Production Deploy is currently deploying a newer commit (${dailyDeploySha}). Skipping isolated app deploy.`,
    );
    return false;
  }

  console.log('Waiting for the Daily Production Deploy to complete...');
  await sleep(TIMEOUT * 60 * 1000);

  return isDeployableToProd(commitSha);
};

const main = () => {
  const environment = process.env.BUILDTYPE;

  if (environment === ENVIRONMENTS.VAGOVPROD)
    return isDeployableToProd(GITHUB_SHA);

  return isDeployableToEnv(GITHUB_SHA, GITHUB_RUN_NUMBER, environment);
};

main()
  .then(deployabilityStatus => {
    core.setOutput('is_deployable', deployabilityStatus);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
