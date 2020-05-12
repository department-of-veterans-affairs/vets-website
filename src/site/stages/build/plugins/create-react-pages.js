/* eslint-disable no-param-reassign, no-continue, no-console */
const path = require('path');
const appRegistry = require('../../../../applications/registry.json');

function createReactPages() {
  return (files, metalsmith, done) => {
    appRegistry.forEach(({ entryName, appName, rootUrl, template }) => {
      const trimmedUrl = path.join('.', rootUrl);
      const filePath = path.join(trimmedUrl, 'index.html');

      if (!files[filePath]) {
        console.log(
          `Generating HTML template for application ${appName} at ${rootUrl}`,
        );
        files[filePath] = {
          title: appName,
          entryname: entryName,
          path: trimmedUrl,
          layout: 'page-react.html',
          contents: Buffer.from('\n<!-- Generated from manifest.json -->\n'),
          ...template,
        };
      }
    });

    done();
  };
}

module.exports = createReactPages;
