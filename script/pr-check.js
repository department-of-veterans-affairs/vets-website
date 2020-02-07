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

const octokitDefaults = {
  owner: 'department-of-veterans-affairs',
  repo: 'vets-website',
  pull_number: PR,
};

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

async function getAdditions(pattern) {
  const { data } = await octokit.pulls.get({
    ...octokitDefaults,
    mediaType: {
      format: 'diff',
    },
  });
  const addLinesOut = spawnSync('bash', [`${__dirname}/add_lines.sh`], {
    input: data,
  });

  const grepOut = spawnSync('grep', ['-P', pattern], {
    input: addLinesOut.stdout,
  });

  const additions = grepOut.stdout.toString().split('\n');

  // Remove the last item that is just an empty string
  additions.pop();
  return additions;
}

getAdditions(CODE_PATTERN).then(additions => {
  console.log(additions);

  // First, create a PR review to apply comments to
  octokit.pulls.createReview({
    ...octokitDefaults,
    body: OVERALL_REVIEW_COMMENT,
    event: 'COMMENT',
    comments: additions.map(line => {
      const [filename, offset] = line.split(':');
      return { path: filename, position: offset, body: LINE_COMMENT };
    }),
  });
});
