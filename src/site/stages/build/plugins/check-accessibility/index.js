/* eslint-disable no-console, no-await-in-loop */

const path = require('path');
// const url = require('url');

const executeAxeCheck = require('./helpers/executeAxeCheck');
// const ignoreSpecialPages = require('./helpers/ignoreSpecialPages');
const getErrorOutput = require('./helpers/getErrorOutput');

function getHtmlFileList(files) {
  return Object.keys(files)
    .filter(fileName => path.extname(fileName) === '.html')
    .map(fileName => files[fileName]);
}

function checkAccessibility(buildOptions) {
  return async (files, metalsmith, done) => {
    console.log('Starting accessibility tests...');
    console.time('Accessibility');

    const htmlFiles = getHtmlFileList(files);
    const errors = [];

    for (const file of htmlFiles) {
      const result = await executeAxeCheck({
        url: new URL(file.path, buildOptions.hostUrl),
        contents: file.contents.toString(),
      });

      if (result.violations.length > 0) {
        const output = getErrorOutput(result);
        errors.push(output);
        console.log(output);
      } else {
        console.log(`${result.url}: ✓`);
      }
    }

    console.timeEnd('Accessibility');

    if (errors.length > 0) {
      done(`Failed with ${errors.length} accessibility errors`);
      done(errors);
    }

    done();
  };
}

module.exports = checkAccessibility;
