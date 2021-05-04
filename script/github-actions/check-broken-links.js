const fs = require('fs');
// const path = require('path');
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
// const reportPath = path.join(__dirname, '../../logs/localhost-broken-links.json'); // TODO: Maybe argparse parameter to determine environment
const reportPath = options.path;
const SERVER_URL = options.serverUrl;
const BRANCH_NAME = options.branch.replace('refs/heads/', ''); // format: refs/heads/*
const IS_PROD_BRANCH = BRANCH_NAME === 'master';
const maxBrokenLinks = 10;

let color = 'warning';

// for testing purposes
console.log(`SLACK_COLOR=${color} >> $GITHUB_ENV`); // eslint-disable-line no-console

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

  console.log(`${brokenLinks.brokenLinksCount} broken links found`); // eslint-disable-line no-console
  console.log(`SLACK_MESSAGE=${message} >> $GITHUB_ENV`); // eslint-disable-line no-console

  if (!IS_PROD_BRANCH && !contentOnlyBuild) {
    return;
  }

  console.log(`SLACK_COLOR=${color} >> $GITHUB_ENV`); // eslint-disable-line no-console
}
