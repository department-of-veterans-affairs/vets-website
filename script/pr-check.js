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

/**
 * Add a label to the beginning of added lines in the diff
 * where the label consists of:
 *   - filename
 *   - offset from the top of the diff chunk
 * And both of the label pieces are separated by a colon
 *
 * Modelled after a bash function from this SO answer:
 * https://stackoverflow.com/a/12179492
 */
function labelAdditions(diffOutput) {
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
      // Only reset the position if our current line is the beginning of a diff chunk
      // AND if the previous line marked the beginning of a new file
      position = 1;
    } else if (/@@ -[0-9]+(,[0-9]+)? \+([0-9]+)(,[0-9]+)? @@.*/.test(line)) {
      // Increment the position when we reach the beginning of a new diff chunk
      position++;
    } else if (/^([ +-]).*/.test(line)) {
      // Only add to the output if this line of content is an addition (begins with a "+")
      if (/^[+].*/.test(line)) output.push(`${path}:${position}:${line}`);
      // Increment position for each line of actual content in the diff
      position++;
    }
    previous = line;
  });
  return output;
}

function getPRdiff() {
  return octokit.pulls
    .get({
      ...octokitDefaults,
      mediaType: {
        format: 'diff',
      },
    })
    .then(({ data }) => data);
}

const findPattern = arr => arr.filter(ln => new RegExp(CODE_PATTERN).test(ln));

// First, create a PR review to apply comments to
function createReview(additions) {
  if (additions.length === 0) {
    console.log(`No additions matching the pattern: "${CODE_PATTERN}"`);
    return null;
  }
  console.log(additions);

  return octokit.pulls.createReview({
    ...octokitDefaults,
    body: OVERALL_REVIEW_COMMENT,
    event: 'COMMENT',
    comments: additions.map(line => {
      const [filename, offset] = line.split(':');
      return { path: filename, position: offset, body: LINE_COMMENT };
    }),
  });
}

getPRdiff()
  .then(labelAdditions)
  .then(findPattern)
  .then(createReview);
