/* eslint-disable camelcase */
/* eslint-disable no-console */
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
// Modelled after a bash function from this SO answer:
//   .circleci/config.yml:
function addFileAndOffset(diffOutput) {
  const lines = diffOutput.split('\n');
  let path = null;
  let position = null;
  let previous = null;
  const output = [];

  lines.forEach(line => {
    if (/--- (a\/)?.*/.test(line)) {
      return;
    }
    const match = line.match(/\+\+\+ (b\/)?(.*$)/);

    if (match) {
      path = match[2];
    } else if (/\+\+\+ b.*/.test(previous) && /@@ .* @@.*/.test(line)) {
      position = 1;
    } else if (/@@ -[0-9]+(,[0-9]+)? \+([0-9]+)(,[0-9]+)? @@.*/.test(line)) {
      position++;
    } else if (/^([ +-]).*/.test(line)) {
      output.push(`${path}:${position}:${line}`);
      position++;
    }
    previous = line;
  });
  return output;
}

async function getAdditions(pattern) {
  const { data } = await octokit.pulls.get({
    ...octokitDefaults,
    mediaType: {
      format: 'diff',
    },
  });

  const additions = addFileAndOffset(data).filter(line =>
    new RegExp(pattern).test(line),
  );

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
