const core = require('@actions/core');

const { getAppManifests } = require('../../config/manifest-helpers');

function exportAppList() {
  const applicationList = getAppManifests().map(app => {
    return {
      name: app.appName,
      slug: app.entryName,
    };
  });
  core.setOutput('app_list', applicationList);
}

exportAppList();
