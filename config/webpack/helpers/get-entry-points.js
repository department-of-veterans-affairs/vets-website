const { getEntryManifests } = require('../helpers/get-entry-manifests');
const {
  getWebpackEntryPoints,
} = require('../helpers/get-webpack-entry-points');

function getEntryPoints(entry) {
  const manifestsToBuild = getEntryManifests(entry);

  return getWebpackEntryPoints(manifestsToBuild);
}

module.exports.getEntryPoints = getEntryPoints;
