/* eslint-disable camelcase */
/* eslint-disable no-console */

require('isomorphic-fetch');

const appendQuery = require('append-query');
const { execSync } = require('child_process');

// Get the upstream commit hash, which should represent the latest changes
// that have been pushed to the remote branch.
const getCommitHash = async () =>
  execSync('git rev-parse @{u}')
    .toString()
    .trim();

// Get the review instance deployment data for the latest upstream commit.
const getDeploymentData = commitHash => {
  const baseUrl =
    'https://api.github.com/repos/department-of-veterans-affairs/vets-website/deployments';

  const url = appendQuery(baseUrl, { sha: commitHash });

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data.length) {
        throw new Error('No deployments found. Build is probably in progress.');
      }

      // There should be two deployments; one for the review instance and one
      // for Heroku. The review instance deployment has a `null` description.
      const reviewInstanceDeployment = data.find(
        deployment => deployment.description !== 'Heroku',
      );

      if (!reviewInstanceDeployment) {
        throw new Error(
          "No review instance deployment activity found. Deploy probably hasn't kicked off yet.",
        );
      }

      return reviewInstanceDeployment;
    });
};

// Get the object repreesenting the successful review instance deployment.
// It won't exist yet if the Jenkins build is still in progress.
const getSuccessfulDeployment = deploymentData => {
  // Set this header to go through the GitHub preview API so we can access the
  // `environment_url` attribute later.
  const options = {
    headers: {
      Accept: 'application/vnd.github.ant-man-preview+json',
    },
  };

  return fetch(deploymentData.statuses_url, options)
    .then(response => response.json())
    .then(data => {
      if (!data.length) {
        throw new Error(
          "No review instance deployment statuses found. Deploy probably hasn't kicked off yet.",
        );
      }

      // Response should be an array of statuses representing the activity for
      // this deployment. Look for a deployment status tagged as 'success' (as
      // opposed to just 'pending').
      const successfulDeployment = data.find(
        deployment => deployment.state === 'success',
      );

      if (!successfulDeployment) {
        throw new Error(
          'No successful review instance deployment found. Review instance might still be getting ready.',
        );
      }

      return successfulDeployment;
    });
};

// Get the URL where the review instance was deployed.
// This is the same URL as the 'View deployment' link in the PR.
const getEnvironmentUrl = successfulDeployment => {
  const { environment_url } = successfulDeployment;

  if (!environment_url) {
    throw new Error(
      "Couldn't find the review instance URL. The environment_url property might no longer be included with the GitHub preview API, or it might not have been specified with the deploy.",
    );
  }

  return environment_url;
};

// Build the review instance API URL based on the environment URL.
// Just append '-api' to the first segment of the URL.
const buildReviewInstanceApiUrl = environmentUrl =>
  environmentUrl
    .split('.')
    .reduce(
      (acc, curr, idx) => (idx === 0 ? `${acc}${curr}-api` : `${acc}.${curr}`),
      '',
    );

// Run the watch task with the build pointing to the review instance API.
const runWatch = apiUrl =>
  execSync(`yarn watch --api=${apiUrl}`, { stdio: 'inherit' });

const logError = error => {
  console.error(error);
  return Promise.reject(error);
};

getCommitHash()
  .then(getDeploymentData)
  .then(getSuccessfulDeployment)
  .then(getEnvironmentUrl)
  .then(buildReviewInstanceApiUrl)
  .catch(logError)
  .then(runWatch)
  .catch(() => {}); // Avoid bloating existing console output for build.
