const { getAppManifests } = require('../helpers/get-app-manifests');

function getAppRoutes() {
  return getAppManifests()
    .map(m => m.rootUrl)
    .filter(m => m);
}

module.exports.getAppRoutes = getAppRoutes;
