const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const fetch = require('node-fetch');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  // const time = new Date().toTimeString();
  // core.setOutput('time', time);
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2);
  // console.log(`The event payload: ${payload}`);

  exec
    .exec('git', [
      'diff',
      'origin/master...',
      '-G"eslint-disable"',
      '--exit-code',
      '--name-only',
      'src',
    ])
    .then(exitCode => {
      console.log(`The git diff exit code: ${exitCode}`);
    })
    .catch(err => {
      console.log(`The error: ${err}`);
      const { GITHUB_TOKEN, GITHUB_REPOSITORY, PR } = process.env;
      const url = `https://api.github.com/${GITHUB_REPOSITORY}/issues/${PR}/comments`;

      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          body: 'ESLint disabled - Manual VSP review required',
        }),
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
      });
    });
} catch (error) {
  core.setFailed(error.message);
}
