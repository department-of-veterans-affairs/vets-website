/* eslint-disable no-param-reassign, no-continue */

const assets = require('../assets/resources.json');

function createResourceConfig(options) {
  return (files, metalsmith, done) => {

    const pages = {};

    for (const fileName of Object.keys(files)) {
      const fileData = files[fileName];
      const {
        resource_id: resourceId
      } = fileData;

      if (!resourceId) continue;

      const fileNameWithoutExtension = fileName.slice(0, fileName.indexOf('.md'));

      pages[resourceId] = `/${fileNameWithoutExtension}/`;
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
