/* eslint-disable no-console */
const find = require('find');
const path = require('path');

function getAppManifests(root) {
  return find
    .fileSync(/manifest\.(json|js)$/, path.join(root, './src/applications'))
    .map(file => {
      // eslint-disable-next-line import/no-dynamic-require
      const manifest = require(file);

      manifest.filePath = file;
      manifest.entryFile = path.resolve(
        root,
        path.join(path.dirname(file), manifest.entryFile),
      );

      return manifest;
    });
}

function getWebpackEntryPoints(manifests) {
  return manifests.reduce((apps, next) => {
    // eslint-disable-next-line no-param-reassign
    apps[next.entryName] = next.entryFile;
    return apps;
  }, {});
}

function displayApplications() {
  const root = path.join(__dirname, '../..');
  getAppManifests(root).forEach(manifest => {
    console.log(manifest.appName);
    console.log(path.relative(root, manifest.filePath));
    console.log(`Production: ${manifest.production || false}`);
    console.log('');
  });
}

module.exports = {
  displayApplications,
  getWebpackEntryPoints,
  getAppManifests,
};
