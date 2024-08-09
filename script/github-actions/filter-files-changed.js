/* eslint-disable no-console */
const fs = require('fs');
const core = require('@actions/core');

const changedFiles = process.env.CHANGED_FILE_PATHS
  ? process.env.CHANGED_FILE_PATHS.split(' ')
  : [];

const files = changedFiles.filter(file => fs.existsSync(file)); // remove files that don't exist

console.log(files);

const filteredJSFiles = files.filter(file => /.+\.jsx?$/.test(file)).join(' ');
console.log(filteredJSFiles);
const filteredSCSSFiles = files
  .filter(file => /.+\.s?css$/.test(file))
  .join(' ');

core.setOutput('JSFILES', filteredJSFiles);
core.setOutput('SCSSFILES', filteredSCSSFiles);
