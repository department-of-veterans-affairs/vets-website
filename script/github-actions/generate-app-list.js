const core = require('@actions/core');

const { getAppManifests } = require('../../config/manifest-helpers');
const scaffoldRegistry = require('../../src/applications/registry.scaffold.json');

function exportAppList() {
  const applicationList = getAppManifests().map(app => {
    return [
      app.appName,
      app.entryName,
      app.filePath.substring(app.filePath.indexOf('src')),
      app.rootUrl,
      app.productId || null,
    ];
  });
  const additionalApps = scaffoldRegistry
    .filter(app => app.productDirectory)
    .map(app => {
      return [
        app.appName,
        app.productDirectory.entryName || null,
        app.productDirectory.filePath.substring(
          app.productDirectory.filePath.indexOf('src'),
        ),
        app.rootUrl,
        app.productDirectory.productId || null,
      ];
    });
  const completeAppList = applicationList.concat(additionalApps);
  core.exportVariable('APPLICATION_LIST', completeAppList);
}

exportAppList();
