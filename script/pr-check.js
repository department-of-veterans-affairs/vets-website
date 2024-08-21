/* eslint-disable camelcase */
/* eslint-disable no-console */
const { Octokit } = require('@octokit/rest');
const { isEmpty, sortBy, uniqBy } = require('lodash');

const {
  BOT_NAME, // Name of the bot for the auth token we are using
  GITHUB_REPOSITORY,
  PR_NUMBER: pull_number,
  CODE_PATTERN, // Regex pattern which will trigger a review comment if found
  GITHUB_TOKEN: auth, // Auth token used for the Github API
  LINE_COMMENT, // Review comment for an individual line comment
  OVERALL_REVIEW_COMMENT, // Review comment for the whole review
} = process.env;

if (!pull_number) {
  console.error('PR number not found');
  process.exit();
}

const [owner, repo] = GITHUB_REPOSITORY.split('/');
const octokitDefaults = { owner, repo, pull_number };
const octokit = new Octokit({ auth });

/**
 * Do a diff on the current PR against main
 *
 * @returns {array} An array where each item is a line from the diff
 */
function getPRdiff() {
  return octokit.pulls
    .get({
      ...octokitDefaults,
      mediaType: {
        format: 'diff',
      },
    })
    .then(({ data }) => data.split('\n'));
}

/**
 * A comment is considered outdated if it doesn't have a current `position`.
 * We also want to ignore comments which weren't made by a user with a matching
 * login
 *
 * @returns {array} An array of objects where each object has the comment `body` along with
 * the `path` for the file it was left on and the `position` in the file diff
 */
function getPRbotComments() {
  return octokit.paginate(
    `GET /repos/:owner/:repo/pulls/:pull_number/comments`,
    octokitDefaults,
    ({ data }) =>
      data
        .filter(
          comment =>
            comment.position !== null && comment.user.login === BOT_NAME,
        )
        .map(({ path, body, position }) => ({ path, position, body })),
  );
}

/**
 * Create a Github review on the PR, leaving comments if there are any additions made
 *
 * @param {array} A list of objects with a `path` and `position` of where to
 * leave a comment in the diff
 */
function createReview(additions) {
  console.log(additions);

  octokit.pulls
    .requestReviewers({
      ...octokitDefaults,
      team_reviewers: ['va-platform-cop-frontend'],
    })
    .catch(console.error);

  return octokit.pulls.createReview({
    ...octokitDefaults,
    body: OVERALL_REVIEW_COMMENT,
    event: 'COMMENT',
    comments: additions.map(({ path, position }) => ({
      path,
      position,
      body: LINE_COMMENT,
    })),
  });
}

/**
 * Log the message & data, then exit
 */
function finish(message, data) {
  console.log(message);
  console.log(data);
  process.exit();
}

/**
 * Take the output of a `git diff` and return an array of objects where an addition line
 * is accompanied by the file and position in the diff chunk it was found at.
 *
 * Modelled after a bash function from this SO answer:
 * https://stackoverflow.com/a/12179492
 *
 * @param {array} An array of strings where each string is a line from a `git diff` output
 * @returns {array} An array where each object has a `file`, `position`, and `line`.
 *
 */
function identifyAdditions(diffLines) {
  let path = null;
  let position = null;
  let inNewFile = false;

  return diffLines.reduce((output, line) => {
    if (/--- (a\/)?.*/.test(line)) {
      return output;
    }
    const match = line.match(/\+\+\+ (b\/)?(.*$)/);
    if (match) {
      path = match[2];
    } else if (inNewFile && /@@ .* @@.*/.test(line)) {
      // Only reset the position if our current line is the beginning of a diff chunk
      // AND if the previous line marked the beginning of a new file
      position = 1;
    } else if (/@@ -[0-9]+(,[0-9]+)? \+([0-9]+)(,[0-9]+)? @@.*/.test(line)) {
      // Increment the position when we reach the beginning of a new diff chunk
      position += 1;
    } else if (/^([ +-]).*/.test(line)) {
      // Only add to the output if this line of content is an addition (begins with a "+")
      if (/^[+].*/.test(line)) output.push({ path, position, line });
      // Increment position for each line of actual content in the diff
      position += 1;
    }
    inNewFile = !!match;
    return output;
  }, []);
}

/**
 * Tries to filter the array down to items which match the CODE_PATTERN env variable.
 * If there are no lines that match the pattern, log a message and exit early
 *
 * @param {array} An array of objects where each object has a `line` from a diff
 * @returns {array} An array of objects where each `line` matched a specific pattern
 */
function findPattern(arr) {
  return Promise.resolve(
    arr.filter(({ line }) => new RegExp(CODE_PATTERN).test(line)),
  ).then(
    matchList =>
      isEmpty(matchList)
        ? finish(
            `No additions found matching the pattern: "${CODE_PATTERN}"`,
            matchList,
          )
        : matchList,
  );
}

/**
 * Receives a list of additions and returns a list containing those additions which (if any)
 * are considered "new" in this run.
 */
function filterAgainstPreviousComments(additions) {
  return getPRbotComments()
    .then(comments =>
      // Create sorted list of unique stringified objects for easy comparison
      // Removing the duplicates shouldn't be necessary once everything is working properly
      // because there shouldn't be any duplicates
      sortBy(uniqBy(comments, JSON.stringify), JSON.stringify).map(
        JSON.stringify,
      ),
    )
    .then(uniqueFlatBotComments =>
      // Get all the items that aren't in the list of flattened objects
      additions.filter(
        ({ path, position }) =>
          !uniqueFlatBotComments.includes(
            JSON.stringify({ path, position, body: LINE_COMMENT }),
          ),
      ),
    )
    .then(
      newAdditions =>
        isEmpty(newAdditions)
          ? finish('No new comments to make', additions)
          : newAdditions,
    );
}

getPRdiff()
  .then(identifyAdditions)
  .then(findPattern)
  .then(filterAgainstPreviousComments)
  .then(createReview)
  .finally(() => console.log('Exiting'));
