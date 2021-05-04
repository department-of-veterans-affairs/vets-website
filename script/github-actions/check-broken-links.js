const fs = require('fs');
const commandLineArgs = require('command-line-args');

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'env', alias: 'e', type: String },
  { name: 'path', alias: 'p', type: String },
  { name: 'contentOnlyBuild', alias: 'c', type: Boolean, defaultValue: false },
];

const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);
const IS_PROD_BRANCH = options.env.replace('refs/heads/', '') === 'master'; // format: refs/heads/
const contentOnlyBuild = options.contentOnlyBuild;
// const reportPath = path.join(__dirname, '../../logs/localhost-broken-links.json'); // TODO: Maybe argparse parameter to determine environment
const reportPath = options.path;
const maxBrokenLinks = 10;
let color = 'warning';

console.log('branch name', options.env.replace('refs/heads/', '')); // eslint-disable-line no-console
console.log('rp', reportPath); // eslint-disable-line no-console

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

  // TODO: If this is still relavent, fix format
  // const heading = "@cmshelpdesk ${brokenLinks.brokenLinksCount} broken links found in the `${envName}` build on `${env.BRANCH_NAME}`\n\n${env.RUN_DISPLAY_URL}\n\n"
  // const message = "${heading}\n${brokenLinks.summary}".stripMargin()

  console.log(`${brokenLinks.brokenLinksCount} broken links found`); // eslint-disable-line no-console
  // console.log(message); TODO: Fix message format to display

  if (!IS_PROD_BRANCH && !contentOnlyBuild) {
    return;
  }

  // TODO: Send slack

  if (color === 'danger') {
    console.log(`::set-output name=BROKEN_LINKS::true`); // eslint-disable-line no-console
  }
}
