/* eslint-disable no-console */

const fs = require('fs');
const commandLineArgs = require('command-line-args');

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'branch', alias: 'b', type: String },
  { name: 'contentOnlyBuild', alias: 'c', type: Boolean, defaultValue: false },
  { name: 'envName', alias: 'e', type: String },
  { name: 'path', alias: 'p', type: String },
  { name: 'serverUrl', alias: 's', type: String },
];

const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);
const envName = options.envName;
const contentOnlyBuild = options.contentOnlyBuild;
const reportPath = options.path;
const SERVER_URL = options.serverUrl;
const BRANCH_NAME = options.branch.replace('refs/heads/', ''); // format: refs/heads/*
const IS_PROD_BRANCH = BRANCH_NAME === 'master';
const maxBrokenLinks = 10;

let color = 'warning';

// broken links detected
if (fs.existsSync(reportPath)) {
  const brokenLinksReport = fs.readFileSync(reportPath, 'utf8');
  const brokenLinks = JSON.parse(brokenLinksReport);

  if (
    brokenLinks.isHomepageBroken ||
    brokenLinks.brokenLinksCount > maxBrokenLinks
  ) {
    color = 'danger';
  }

  const heading = `@cmshelpdesk ${
    brokenLinks.brokenLinksCount
  } broken links found in the ${envName} build on ${BRANCH_NAME} \n\n${SERVER_URL}\n\n`;
  const message = `${heading}\n${brokenLinks.summary}`; // TODO: stripMargin equiv

  console.log(`${brokenLinks.brokenLinksCount} broken links found`);
  console.log(`::set-output name=SLACK_MESSAGE::${message}`);

  if (!IS_PROD_BRANCH && !contentOnlyBuild) {
    // Ignore the results of the broken link checker unless
    // we are running either on the master branch or during
    // a Content Release. This way, if there is a broken link,
    // feature branches aren't affected, so VFS teams can
    // continue merging.
    return;
  }

  // TODO: Is this still applicable on GHA?
  // Unset brokenLinks now that we're done with this, because Jenkins may temporarily
  // freeze (through serialization) this pipeline while the Slack message is being sent.
  // brokenLinks is an instance of JSONObject, which cannot be serialized by default.
  // brokenLinks = null;

  if (color === 'danger') {
    throw new Error('Broken links found');
  }

  console.log(`::set-output name=SLACK_COLOR::${color}`);
}
