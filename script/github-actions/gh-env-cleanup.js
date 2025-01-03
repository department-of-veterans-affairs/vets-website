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

    console.log(`Total environments fetched: ${environments.length}`);
    return environments;
  } catch (error) {
    console.error('Error fetching environments:', error);
    process.exit(1);
  }
};

// Replace with your repository owner and name
const OWNER = 'department-of-veterans-affairs';
const REPO = 'vets-website';

(async () => {
  const environments = await fetchAllEnvironments(OWNER, REPO);
  console.log('Fetched environments:', JSON.stringify(environments, null, 2));
})();
