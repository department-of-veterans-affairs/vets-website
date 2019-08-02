/* eslint-disable no-param-reassign, no-console, no-continue */

const path = require('path');

const ENVIRONMENTS = require('../../../../constants/environments');

const getBrokenLinks = require('./helpers/getBrokenLinks');
const applyIgnoredRoutes = require('./helpers/applyIgnoredRoutes');
const getErrorOutput = require('./helpers/getErrorOutput');

function middleware(buildOptions) {
  return (files, metalsmith, done) => {
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

      if (buildOptions.buildtype === ENVIRONMENTS.VAGOVPROD) {
        done(errorOutput);
        return;
      }
      console.log(errorOutput);
    }

    done();
  };
}

module.exports = middleware;
