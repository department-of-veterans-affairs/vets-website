const core = require('@actions/core');

const { getAppManifests } = require('../../config/manifest-helpers');

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
  core.exportVariable('APPLICATION_LIST', applicationList);
}

exportAppList();
