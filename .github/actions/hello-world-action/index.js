const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

try {
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
      // 'src',
    ])
    .then(exitCode => {
      console.log(`The git diff exit code: ${exitCode}`);
    })
    .catch(err => {
      console.log(`The error: ${err}`);
      const { GITHUB_SHA, GITHUB_REPOSITORY, PR } = process.env;
      const url = `https://api.github.com/${GITHUB_REPOSITORY}/issues/${PR}/comments`;

      const token = core.getInput('token');
      const octokit = new github.GitHub(token);
      octokit.pulls.createComment({
        owner: 'department-of-veterans-affairs',
        repo: 'vets-website',
        pull_number: PR,
        body: 'Do something on this line',
        commit_id: GITHUB_SHA,
        path: 'src/site/stages/build/process-cms-exports/schema-validation.js',
        line: 13,
        side: 'RIGHT',
        mediaType: {
          previews: ['comfort-fade'],
        },
      });
    });
} catch (error) {
  core.setFailed(error.message);
}
