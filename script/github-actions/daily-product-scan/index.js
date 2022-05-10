/* eslint-disable no-console */
const main = require('./main');
const GitHubClient = require('./github-client');

(async () => {
  const { changesDetected, status, message, data } = await main({
    octokit: new GitHubClient(),
  });

  if (process.env.MANIFEST_GLOB_PATH) {
    if (changesDetected !== undefined)
      console.log(`changes detected: ${changesDetected}`);
    console.log(`status: ${status}`);
    console.log(`message: ${message}`);
    console.log(`data: ${data}`);
  }
})();
