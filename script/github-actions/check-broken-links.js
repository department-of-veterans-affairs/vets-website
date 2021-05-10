/* eslint-disable no-console */

const fs = require('fs');
// const commandLineArgs = require('command-line-args');
const args = process.argv.slice(2);

// const COMMAND_LINE_OPTIONS_DEFINITIONS = [
//   { name: 'branch', alias: 'b', type: String },
//   { name: 'contentOnlyBuild', alias: 'c', type: Boolean, defaultValue: false },
//   { name: 'envName', alias: 'e', type: String },
//   { name: 'path', alias: 'p', type: String },
//   { name: 'serverUrl', alias: 's', type: String },
// ];

console.log('args', args);

// const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);
const envName = args[0];
const contentOnlyBuild = !!args[1];
// const reportPath = options.path;
// const SERVER_URL = options.serverUrl;
// const BRANCH_NAME = options.branch.replace('refs/heads/', ''); // format: refs/heads/*
const reportPath = `./logs/${envName}-broken-links.json`;
const SERVER_URL = `${process.env.GITHUB_SERVER_URL}/${
  process.env.GITHUB_REPOSITORY
}/actions/runs/${process.env.GITHUB_RUN_ID}`;
const BRANCH_NAME = process.env.GITHUB_HEAD_REF;
const IS_PROD_BRANCH = BRANCH_NAME === 'master';
const maxBrokenLinks = 10;

console.log('branch_name', BRANCH_NAME);
console.log('server_url', SERVER_URL);
console.log('CB', contentOnlyBuild);

// broken links detected
if (fs.existsSync(reportPath)) {
  const brokenLinksReport = fs.readFileSync(reportPath, 'utf8');
  const brokenLinks = JSON.parse(brokenLinksReport);
  const shouldFail =
    brokenLinks.isHomepageBroken ||
    brokenLinks.brokenLinksCount > maxBrokenLinks;
  const color = shouldFail ? 'danger' : 'warning';

  const heading = `@cmshelpdesk ${
    brokenLinks.brokenLinksCount
  } broken links found in the ${envName} build on ${BRANCH_NAME} \n\n${SERVER_URL}\n\n`;
  const message = `${heading}\n${brokenLinks.summary}`;

  console.log(
    `${brokenLinks.brokenLinksCount} broken links found. \n ${
      brokenLinks.summary
    }`,
  );

  if (!IS_PROD_BRANCH && !contentOnlyBuild) {
    // Ignore the results of the broken link checker unless
    // we are running either on the master branch or during
    // a Content Release. This way, if there is a broken link,
    // feature branches aren't affected, so VFS teams can
    // continue merging.
    return;
  }

  if (color === 'danger') {
    throw new Error('Broken links found');
  }

  console.log(`::set-output name=SLACK_MESSAGE::${message}`);
  console.log(`::set-output name=SLACK_COLOR::${color}`);
}
