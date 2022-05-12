/* eslint-disable no-console */
const main = require('./main');
const GitHubClient = require('./github-client');

(async () => {
  const { changeDetected, status, message, data } = await main({
    octokit: new GitHubClient(),
  });

  if (process.env.MANIFEST_GLOB_PATH) {
    console.log(`status: ${status}`);
    console.log(`change detected: ${changeDetected}`);
    console.log(`message: ${message}`);
    console.log(`data: ${data}`);
  }
})();
