/* eslint-disable camelcase */
/* eslint-disable no-console */
const { spawnSync } = require('child_process');
const { Octokit } = require('@octokit/rest');

const {
  CODE_PATTERN,
  GITHUB_TOKEN,
  CIRCLE_PULL_REQUEST,
  OVERALL_REVIEW_COMMENT,
  LINE_COMMENT,
} = process.env;
const PR = CIRCLE_PULL_REQUEST.split('/').pop();

function getAdditions(pattern) {
  const diffOut = spawnSync('git', ['diff', 'origin/master...']);
  const addLinesOut = spawnSync('bash', [`${__dirname}/add_lines.sh`], {
    input: diffOut.stdout,
  });
  const grepOut = spawnSync('grep', ['-P', pattern], {
    input: addLinesOut.stdout,
  });

  const additions = grepOut.stdout.toString().split('\n');

  // Remove the last item that is just an empty string
  additions.pop();
  return additions;
}

const additions = getAdditions(CODE_PATTERN);

console.log(additions);

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

console.log(PR);

// First, create a PR review to apply comments to
// let reviewId = null;
octokit.pulls.createReview({
  owner: 'department-of-veterans-affairs',
  repo: 'vets-website',
  body: OVERALL_REVIEW_COMMENT,
  event: 'COMMENT',
  pull_number: PR,
  comments: additions.map(line => {
    const [filename, offset] = line.split(':');
    return { path: filename, position: offset, body: LINE_COMMENT };
  }),
});
