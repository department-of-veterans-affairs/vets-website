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

const getInProgressWorkflowRuns = () => {
  const params = {
    owner,
    repo,
    workflow_id: 'daily-deploy-production.yml',
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

const getLastFullDeployCommit = async () => {
  const prodBuildTextUrl = new URL(
    path.join(BUCKETS[ENVIRONMENTS.VAGOVPROD], 'BUILD.txt'),
  );

  const response = await fetch(prodBuildTextUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${prodBuildTextUrl}.\n${response.statusText}`,
    );
  }

  const buildTextFile = await response.text();
  const lines = buildTextFile.split('\n').filter(row => row);

  return lines[6]?.slice(4);
};

/**
 * Checks whether the first commit is an ancestor of the second commit.
 * @param {string} commitA - Possible ancestor
 * @param {string} commitB - Possible descendant
 * @returns {Boolean}
 */
const isAncestor = (commitA, commitB) => {
  return (
    commitA !== commitB &&
    runCommandSync(`git merge-base --is-ancestor ${commitA} ${commitB}`)
  );
};

const canCommitDeploy = async isolatedAppSha => {
  const lastFullDeployCommit = await getLastFullDeployCommit();
  const isAheadOfLastFullDeploy = isAncestor(
    isolatedAppSha,
    lastFullDeployCommit,
  );

  // This prevents old commits that are rerun from deploying to production
  if (!isAheadOfLastFullDeploy) return false;

  const inProgressWorkflowRuns = await getInProgressWorkflowRuns();
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

  return canCommitDeploy(isolatedAppSha);
};

canCommitDeploy(GITHUB_SHA)
  .then(deployabilityStatus => {
    core.setOutput('is_deployable', deployabilityStatus);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
