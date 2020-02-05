const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const { spawnSync } = require('child_process');

try {
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2);
  // console.log(`The event payload: ${payload}`);

  let myOutput = '';

  const options = {};
  options.listeners = {
    stdout: data => {
      myOutput += data.toString();
    },
  };

  const diffOut = spawnSync('git', ['diff', 'origin/master...']);
  const addLinesOut = spawnSync('bash', [`${__dirname}/add_lines.sh`], {
    input: diffOut.stdout,
  });
  const grepOut = spawnSync(
    'grep',
    ['-P', `(/* eslint-disable)|(// eslint-disable)`],
    { input: addLinesOut.stdout },
  );

  console.log(grepOut.stdout.toString());

  exec
    .exec(
      'git',
      [
        'diff',
        'origin/master...',
        '--exit-code',
        '| bash add_lines.sh',
        `| grep -P "(\/\* eslint-disable)|(\/\/ eslint-disable)"`,
        // '--name-only',
        // 'src',
      ],
      options,
    )
    .then(exitCode => {
      console.log(`The git diff exit code: ${exitCode}`);

      console.log(myOutput);
    })
    .catch(err => {
      console.log(`The error: ${err}`);

      console.log(myOutput);
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
