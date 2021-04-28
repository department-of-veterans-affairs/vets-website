/* eslint-disable no-param-reassign, no-console, no-continue */

const path = require('path');
const fs = require('fs-extra');

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

    this.logFile = path.join(
      __dirname,
      '../../../../../../../logs',
      `${buildOptions.buildtype}-broken-links.json`,
    );

    if (fs.existsSync(this.logFile)) {
      fs.removeSync(this.logFile);
    }
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
      const csvReport = getErrorOutput(this.brokenPages);
      const brokenLinksJson = {
        message: csvReport,
        status: 'error',
      };

      fs.writeJSONSync(this.logFile, brokenLinksJson);
      console.log(`Broken links found. See results in ${this.logFile}.`);

      if (buildOptions['drupal-fail-fast']) {
        throw new Error(brokenLinksJson);
      }
    }
  },
};
