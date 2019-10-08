/* eslint-disable no-param-reassign, no-console, no-continue */

const path = require('path');

const _getBrokenLinks = require('./helpers/getBrokenLinks');
const _applyIgnoredRoutes = require('./helpers/applyIgnoredRoutes');
const _getErrorOutput = require('./helpers/getErrorOutput');

/**
 * Metalsmith middleware for verifying HREF/SRC values in HTML files are valid file references.
 */
function getMiddleware(
  buildOptions,
  getBrokenLinks = _getBrokenLinks,
  applyIgnoredRoutes = _applyIgnoredRoutes,
  getErrorOutput = _getErrorOutput,
) {
  return (files, metalsmith, done) => {
    // 1. Loop through all of the HTML files in the Metalsmith pipeline
    // 2. Extract all of the broken HREF/SRC values using the helper getBrokenLinks
    // 3. Format the result into useful console output
    // 4. Break the build on production; just log the output on lower environments.

    const fileNames = Object.keys(files);
    const allPaths = new Set(fileNames);

    let brokenPages = [];

    for (const fileName of fileNames) {
      const isHtml = path.extname(fileName) === '.html';
      if (!isHtml) continue;

      const file = files[fileName];
      const linkErrors = getBrokenLinks(file, allPaths);

      if (linkErrors.length > 0) {
        brokenPages.push({
          path: file.path,
          linkErrors,
        });
      }
    }

    brokenPages = applyIgnoredRoutes(brokenPages, files);

    if (brokenPages.length > 0) {
      const errorOutput = getErrorOutput(brokenPages);

      if (buildOptions['drupal-fail-fast']) {
        done(errorOutput);
        return;
      }

      console.log(errorOutput);
    }

    done();
  };
}

module.exports = getMiddleware;
