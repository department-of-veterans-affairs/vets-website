/* eslint-disable camelcase */
const { spawnSync } = require('child_process');
const { Octokit } = require('@octokit/rest');

const diffOut = spawnSync('git', ['diff', 'origin/master...']);
const addLinesOut = spawnSync('bash', [`${__dirname}/add_lines.sh`], {
  input: diffOut.stdout,
});
const grepOut = spawnSync(
  'grep',
  ['-P', `(/* eslint-disable)|(// eslint-disable)`],
  { input: addLinesOut.stdout },
);

/* eslint-disable no-console */
console.log('spawnSync out: ', grepOut.stdout.toString());
const additions = grepOut.stdout.toString().split('\n');

// Remove the last item that is just an empty string
additions.pop();

console.log(additions);

const { GITHUB_TOKEN, CIRCLE_PULL_REQUEST } = process.env;
const PR = CIRCLE_PULL_REQUEST.split('/').pop();

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

console.log(PR);

function reviewComments() {
  const comments = [];
  additions.forEach(line => {
    const [filename, offset] = line.split(':');
    comments.push({ path: filename, position: offset, body: 'Testing' });
  });
  return comments;
}

// First, create a PR review to apply comments to
// let reviewId = null;
octokit.pulls.createReview({
  owner: 'department-of-veterans-affairs',
  repo: 'vets-website',
  body: 'Some issues found',
  event: 'COMMENT',
  pull_number: PR,
  comments: reviewComments(),
});
// .then(response => {
//   reviewId = response.id;
// });

// function createReviewComments() {
//   // const comments = [];
//   additions.forEach(async line => {
//     const [filename, lineNumber] = line.split(':');
//     console.log(filename, lineNumber);

//     try {
//       await octokit.pulls.createComment({
//         owner: 'department-of-veterans-affairs',
//         repo: 'vets-website',
//         pull_number: PR,
//         body: 'Flagging for manual review',
//         commit_id: CIRCLE_SHA1,
//         path: filename,
//         line: parseInt(lineNumber, 10),
//         side: 'RIGHT',
//         mediaType: {
//           previews: ['comfort-fade'],
//         },
//       });
//     } catch (error) {
//       console.log(`The error is ${error}`);
//     }
//     console.log('NEXT COMMENT');
//     // .then(response => {
//     //   console.log('YAAAY! Success!!');
//     //   // console.log(response);
//     // })
//     // .catch(error => {
//     //   console.log(`The error is ${error}`);
//     // });

//     // comments.push(promise);
//   });

//   // return comments;
// }

// console.log('BEGINNING');
// createReviewComments();

// console.log('ALL DONE');

// Promise.all(createReviewComments()).then(() => {
//   octokit.pulls.submitReview({
//     owner: 'department-of-veterans-affairs',
//     repo: 'vets-website',
//     pull_number: PR,
//     review_id: reviewId,
//     event: 'COMMENT',
//   });
// });

/*
exec
  .exec(
    'git',
    [
      'diff',
      'origin/master...',
      '--exit-code',
      // '| bash add_lines.sh',
      // `| grep -P "(\/\* eslint-disable)|(\/\/ eslint-disable)"`,
      '--name-only',
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
/* */
