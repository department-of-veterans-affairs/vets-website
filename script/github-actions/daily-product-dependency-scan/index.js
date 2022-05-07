/* eslint-disable no-console */
const main = require('./main');
const GitHubClient = require('./github-client');

(async () => {
  const { status, message, data } = await main({ octokit: new GitHubClient() });
  console.log(`status: ${status}`);
  console.log(`message: ${message}`);
  console.log(`data: ${data}`);
})();
