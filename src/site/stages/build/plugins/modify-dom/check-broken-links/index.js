/* eslint-disable no-param-reassign, no-console, no-continue */

const path = require('path');

const getBrokenLinks = require('./helpers/getBrokenLinks');
const applyIgnoredRoutes = require('./helpers/applyIgnoredRoutes');
const getErrorOutput = require('./helpers/getErrorOutput');

/**
 * Metalsmith middleware for verifying HREF/SRC values in HTML files are valid file references.
 */

module.exports = {
  initialize(buildOptions, files) {
    const fileNames = Object.keys(files);
    this.allPaths = new Set(fileNames);
    this.brokenPages = [];
  },

  modifyFile(fileName, file, files, buildOptions) {
    if (buildOptions.watch) {
      return;
    }

    const isHtml = path.extname(fileName) === '.html';
    if (!isHtml) return;

    const linkErrors = getBrokenLinks(file, this.allPaths);

    if (linkErrors.length > 0) {
      this.brokenPages.push({
        path: file.path,
        linkErrors,
      });
    }
  },

  conclude(buildOptions, files) {
    this.brokenPages = applyIgnoredRoutes(this.brokenPages, files);

    if (this.brokenPages.length > 0) {
      const errorOutput = getErrorOutput(this.brokenPages);

      if (buildOptions['drupal-fail-fast']) {
        throw new Error(errorOutput);
      }

      console.log(errorOutput);
    }
  },
};
