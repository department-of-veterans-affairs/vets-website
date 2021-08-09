/* eslint-disable no-console */
const args = process.argv.slice(2);
const files = args[0].slice(1, -1).split(','); // remove unnecessary characters
const filteredJSFiles = files.filter(file => /.+\.jsx?$/.test(file)).join(' ');
const filteredSCSSFiles = files
  .filter(file => /.+\.s?css$/.test(file))
  .join(' ');

console.log('files: ', files);
console.log(`::set-output name=JSFILES::${filteredJSFiles}`);
console.log(`::set-output name=SCSSFILES::${filteredSCSSFiles}`);
