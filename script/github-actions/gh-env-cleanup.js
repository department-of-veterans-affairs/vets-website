/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */

const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const fetchAllEnvironments = async (owner, repo) => {
  let environments = [];
  let page = 1;

  try {
    while (true) {
      console.log(`Fetching page ${page}...`);

      // Fetch environments for the current page
      const { data } = await octokit.request(
        'GET /repos/{owner}/{repo}/environments',
        {
          owner,
          repo,
          per_page: 100,
          page,
        },
      );

      // Append to environments array
      environments = environments.concat(data.environments);

      // If no more environments, exit the loop
      if (data.environments.length === 0) {
        break;
      }

      page++;
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
    return createdAt < cutoffDate;
  });
};

// Replace with your repository owner and name
const OWNER = 'department-of-veterans-affairs';
const REPO = 'vets-website';
const DAYS = 120;
(async () => {
  const environments = await fetchAllEnvironments(OWNER, REPO);
  const oldEnvironments = filterOldEnvironments(environments, DAYS);
  console.log(`total environments: ${environments.length}`);
  console.log(
    'nonprod environments:',
    JSON.stringify(environments, null, 2).length,
  );
  console.log(`environments older than 120 days: `, oldEnvironments.length);
  console.log(
    `nonproduction environments older than 120 days: `,
    oldEnvironments.filter(env => env.name !== 'production').length,
  );
  console.log(
    `environments without protection rules older than 120 days: `,
    oldEnvironments.filter(env => env.protection_rules.length === 0).length,
  );

  const environmentsWithProtectionRules = environments.filter(
    environments.protection_rules.length > 0,
  );

  console.log(
    `environments with protection rules: `,
    environmentsWithProtectionRules,
  );
})();
