const assets = require('../assets/resources.json');

function createResourceConfig(options) {
  const resources = {
    ...assets,
    pages: {}
  };

  return (files, metalsmith, done) => {
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
