/* eslint-disable no-param-reassign, no-continue, no-console */
const path = require('path');
const manifestHelpers = require('../webpack/manifest-helpers');

function createTemporaryReactPages() {
  return (files, metalsmith, done) => {
    const root = path.join(__dirname, '../../../../..');
    manifestHelpers
      .getAppManifests(root)
      // Skip manifests that are mapping the url from settings.js
      .filter(m => m.rootUrl)
      .forEach(({ entryName, appName, rootUrl, template }) => {
        const trimmedUrl = path.join('.', rootUrl);
        const filePath = path.join(trimmedUrl, 'index.md');

        if (!files[filePath]) {
          console.log(
            `Generating HTML template for application ${appName} at ${rootUrl}`,
          );
          files[filePath] = {
            title: appName,
            entryname: entryName,
            path: trimmedUrl,
            contents: Buffer.from('\n<!-- Generated from manifest.json -->\n'),
            ...template,
          };
        }
      });

    done();
  };
}

module.exports = createTemporaryReactPages;
