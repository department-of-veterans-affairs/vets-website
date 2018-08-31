/* eslint-disable no-param-reassign, no-continue, no-console */

const assets = require('../assets/resources.json');

function createResourceConfig(options) {
  return (files, metalsmith, done) => {

    const pages = {};

    for (const fileName of Object.keys(files)) {
      const fileData = files[fileName];
      const {
        resource_id: resourceId,
        permalink
      } = fileData;

      if (!resourceId) continue;

      const path = permalink ? permalink.replace('index.html', '') : `/${fileName.replace('.md', '')}/`;

      if (pages[resourceId]) {
        console.warn(`Detected duplicate resource_id's: ${resourceId}`);
      }

      pages[resourceId] = path;
    }

    const resources = {
      ...assets,
      pages
    };

    metalsmith.metadata({ resources });
    options.resources = resources;

    done();
  };
}

module.exports = createResourceConfig;
