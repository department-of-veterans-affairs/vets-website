/**
 * Build steps within this file are executed by Jenkins after the rest of the site builds and integration tests have run,
 * so they are considered high risk. You should only add a step here if it is absolutely necessary. Otherwise, it should be
 * processed as a regular build step in build.js.
 */

const path = require('path');
const fs = require('fs');
const commandLineArgs = require('command-line-args');

const linkAssetsToBucket = require('./link-assets-to-bucket');

function gatherCommandsArgs() {
  const commandArgDefinitions = [{ name: 'buildtype', type: String }];

  return commandLineArgs(commandArgDefinitions);
}

function getFiles(directory, fileList = []) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const fileStatus = fs.statSync(filePath);

    if (fileStatus.isDirectory()) {
      getFiles(filePath, fileList);
    } else if (path.extname(file) === '.html') {
      fileList.push(filePath);
    }
  }

  return fileList;
}

function main() {
  const options = gatherCommandsArgs();
  const directory = path.join(__dirname, '../../build', options.buildtype);
  const fileNames = getFiles(directory);

  linkAssetsToBucket(options, fileNames);
}

main();
