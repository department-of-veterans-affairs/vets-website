/**
 * This script reads the build log output by Jenkins in the build
 * step, checks for broken links, and if there are any, outputs a CSV
 * file to be uploaded to Slack.
 */

// eslint gets mad at the s flag in a regex
/* eslint-disable no-empty-character-class */
/* eslint-disable no-console */

const commandLineArgs = require('command-line-args');
const fs = require('fs-extra');

const optionDefinitions = [
  { name: 'log-file', alias: 'l', type: String },
  { name: 'output', alias: 'o', type: String },
];

const options = commandLineArgs(optionDefinitions);

// Sanity checking
if (!options['log-file']) {
  console.error('Missing arg: --log-file');
  process.exit(1);
}
if (!options.output) {
  console.error('Missing arg: --output');
  process.exit(1);
}

// Read the build log supplied by the arg
let rawLogContents;
try {
  rawLogContents = fs.readFileSync(options['log-file']);
} catch (e) {
  if (e.code === 'ENOENT') {
    console.log(`${options['log-file']} does not exist.`);
    process.exit();
  }
  // It exists, but something else weird happened; throw up
  throw e;
}

const log = rawLogContents.toString();

// Check if there are any broken links
const linkLineRegex = /^There are \d+ broken links!$/m;
const linkCountMatch = linkLineRegex.exec(log);
if (!linkCountMatch) {
  // No broken links found in the output
  process.exit();
}

const output = ['Page,Broken Link'];

// Grab all the text pertinent to broken links
//  "There are \d+ broken links!" until the end of the file
const brokenSection = log.split(linkLineRegex)[1].trim();

// Grab each block between lines of "---"
const pageChunkMatches = brokenSection.match(
  /There are \d+ broken links on.*?---/gs,
);
pageChunkMatches.forEach(chunk => {
  //  Grab the name of the page
  const pageName = chunk.match(/There are \d+ broken links on (.+):/)[1];

  //  Grab each line in the block of HTML elements
  chunk
    .match(/\n\n(.*)\n\n/s)[1]
    .split('\n')
    .forEach(line => output.push(`${pageName},${line}`));
});

// Write the CSV file
fs.writeFileSync(options.output, output.join('\n'));
