const core = require('@actions/core');

const { getAppManifests } = require('../../config/manifest-helpers');

function exportAppList() {
  const applicationList = getAppManifests().map(app => {
    return [app.appName, app.entryName];
  });
  core.exportVariable('APPLICATION_LIST', applicationList);
}

exportAppList();
