const assets = require('../assets/resources.json');

/* eslint-disable no-param-reassign, no-continue */

function createResourceConfig(options) {
  return (files, metalsmith, done) => {

    const resources = {
      ...assets,
      pages: {}
    };

    for (const fileName of Object.keys(files)) {
      const fileData = files[fileName];
      const {
        resource_id: resourceId,
        redirects
      } = fileData;

      if (!resourceId) continue;

      resources.pages[resourceId] = {
        location: `/${fileName}`,
        redirects
      };
    }

    metalsmith.metadata({ resources });
    options.resources = resources;

    done();
  };
}

module.exports = createResourceConfig;
