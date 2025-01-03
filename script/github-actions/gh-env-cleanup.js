/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
const { Octokit } = require('@octokit/rest');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const fetchAllEnvironments = async (owner, repo) => {
  let environments = [];
  let page = 1;

  try {
    while (true) {
      console.log(`Fetching page ${page}...`);

      const { data } = await octokit.request(
        'GET /repos/{owner}/{repo}/environments',
        {
          owner,
          repo,
          per_page: 100,
          page,
        },
      );

      environments = environments.concat(data.environments);

      if (data.environments.length === 0) {
        break;
      }

      page += 1;
    }

    return environments;
  } catch (error) {
    console.error('Error fetching environments:', error);
    process.exit(1);
  }
};

const filterOldEnvironments = (environments, days) => {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return environments.filter(env => {
    const createdAt = new Date(env.created_at);
    return createdAt < cutoffDate && env.protection_rules.length === 0;
  });
};

const deleteEnvironment = async (owner, repo, environment) => {
  try {
    await octokit.request(
      'DELETE /repos/{owner}/{repo}/environments/{environment_name}',
      {
        owner,
        repo,
        environment_name: environment.name,
      },
    );
    console.log(`Successfully deleted environment: ${environment.name}`);
  } catch (error) {
    console.error(`Error deleting environment ${environment.name}:`, error);
  }
};

const OWNER = 'department-of-veterans-affairs';
const REPO = 'vets-website';
const DAYS = 90;

(async () => {
  const environments = await fetchAllEnvironments(OWNER, REPO);
  const oldEnvironments = await filterOldEnvironments(environments, DAYS);

  console.log('Deleting ', oldEnvironments.length, ` envioronments`);

  for (const environment of oldEnvironments) {
    await deleteEnvironment(OWNER, REPO, environment);
    await delay(2000);
  }
})();
