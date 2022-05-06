/* eslint-disable no-console */
const main = require('./main');
const GitHub = require('./github');

(async () => {
  const { status, message, data } = await main({ octokit: new GitHub() });
  console.log(`status: ${status}`);
  console.log(`message: ${message}`);
  console.log(`data: ${data}`);
})();
