/* eslint-disable no-console */
const fs = require('fs');

const args = process.argv.slice(2);
const files = args[0]
  .slice(1, -1) // remove unnecessary characters
  .split(',')
  .filter(file => fs.existsSync(file)); // remove files that don't exist

const filteredJSFiles = files.filter(file => /.+\.jsx?$/.test(file)).join(' ');
const filteredSCSSFiles = files
  .filter(file => /.+\.s?css$/.test(file))
  .join(' ');

console.log(`::set-output name=JSFILES::${filteredJSFiles}`);
console.log(`::set-output name=SCSSFILES::${filteredSCSSFiles}`);
