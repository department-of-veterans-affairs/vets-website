/* eslint-disable no-console */
/* eslint-disable camelcase */
const path = require('path');
const fetch = require('node-fetch');
const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');
const { runCommandSync, sleep } = require('../utils');

const BUCKETS = require('../../src/site/constants/buckets');
const ENVIRONMENTS = require('../../src/site/constants/environments');

const { GITHUB_TOKEN: auth, GITHUB_REPOSITORY, GITHUB_SHA } = process.env;
const [owner, repo] = GITHUB_REPOSITORY.split('/');

const octokit = new Octokit({ auth });

const getInProgressWorkflowRuns = workflow_id => {
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

const getLastFullDeployCommit = async env => {
  const envBucketUrl = BUCKETS[env];
  const buildTextUrl = new URL(path.join(envBucketUrl, 'BUILD.txt'));

  const response = await fetch(buildTextUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${buildTextUrl}.\n${response.statusText}`);
  }

  const buildTextFile = await response.text();
  const lines = buildTextFile.split('\n').filter(line => line);

  return lines[6]?.slice(4);
};

/**
 * Checks whether the first commit is an ancestor of the second commit.
 * @param {string} commitA - Possible ancestor
 * @param {string} commitB - Possible descendant
 * @returns {Boolean}
 */
const isAncestor = (commitA, commitB) => {
  const exitCode = runCommandSync(
    `git merge-base --is-ancestor ${commitA} ${commitB}`,
  );

  if (![0, 1].includes(exitCode)) {
    console.error(
      `'git merge-base --is-ancestor' exited with an unsuccessful code (${exitCode}).`,
    );
    process.exit(1);
  }

  return commitA !== commitB && exitCode === 0;
};

const canCommitDeploy = async env => {
  const lastFullDeployCommit = await getLastFullDeployCommit(env);
  const isAheadOfLastFullDeploy = isAncestor(GITHUB_SHA, lastFullDeployCommit);
  console.log(isAheadOfLastFullDeploy);

  // This prevents commits older than the last full deploy from deploying
  if (!isAheadOfLastFullDeploy) return false;

  const inProgressWorkflowRuns = await getInProgressWorkflowRuns(
    'continuous-integration.yml',
  );
  if (inProgressWorkflowRuns.length === 1) return true;

  const previousCommitsInProgress = inProgressWorkflowRuns.find(workflowRun =>
    isAncestor(workflowRun.head_sha, GITHUB_SHA),
  );

  if (!previousCommitsInProgress) return true;

  const timeout = 5; // Number of minutes to wait before checking again
  console.log('Waiting for previous workflow runs to finish deploying...');
  await sleep(timeout * 60 * 1000);

  return canCommitDeploy(env);
};

const canCommitDeployProd = async isolatedAppSha => {
  const lastFullDeployCommit = await getLastFullDeployCommit(
    ENVIRONMENTS.VAGOVPROD,
  );
  const isAheadOfLastFullDeploy = isAncestor(
    isolatedAppSha,
    lastFullDeployCommit,
  );

  // This prevents old commits that are rerun from deploying to production
  if (!isAheadOfLastFullDeploy) return false;

  const inProgressWorkflowRuns = await getInProgressWorkflowRuns(
    'daily-deploy-production.yml',
  );
  if (inProgressWorkflowRuns.length === 0) return true;

  // Get the first item in the Array. Since daily production deploy workflow runs
  // aren't concurrent, there should be only one deploy happening at a time.
  const dailyProdDeploySha = inProgressWorkflowRuns[0].head_sha;

  // Checks whether the isolated app commit is ahead of the daily prod deploy commit.
  const isAheadOfDailyDeploy = isAncestor(isolatedAppSha, dailyProdDeploySha);
  if (!isAheadOfDailyDeploy) return false;

  const timeout = 10; // Number of minutes to wait before checking again
  console.log('Waiting for the Daily Production Deploy to complete...');
  await sleep(timeout * 60 * 1000);

  return canCommitDeployProd(isolatedAppSha);
};

const main = () => {
  const environment = process.env.BUILDTYPE;

  if (environment === ENVIRONMENTS.VAGOVPROD)
    return canCommitDeployProd(GITHUB_SHA);
  return canCommitDeploy(environment);
};

main()
  .then(deployabilityStatus => {
    core.setOutput('is_deployable', deployabilityStatus);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
