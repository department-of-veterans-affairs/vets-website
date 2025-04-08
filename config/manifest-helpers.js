/* eslint-disable no-console */
const path = require('path');
const glob = require('glob');

const root = path.join(__dirname, '..');

function getAppManifests() {
  const pattern = path.join(root, 'src/applications/**/manifest.@(json|js)');
  const files = glob.sync(pattern, { ignore: '**/node_modules/**' });

  return files.map(file => {
    // eslint-disable-next-line import/no-dynamic-require
    const manifest = require(file);

    return {
      ...manifest,
      filePath: file,
      entryFile: path.resolve(
        root,
        path.join(path.dirname(file), manifest.entryFile),
      ),
    };
  });
}

function getAppRoutes() {
  return getAppManifests()
    .map(m => m.rootUrl)
    .filter(m => m);
}

function getWebpackEntryPoints(manifests) {
  return manifests.reduce((apps, next) => {
    // eslint-disable-next-line no-param-reassign
    apps[next.entryName] = next.entryFile;
    return apps;
  }, {});
}

function displayApplications() {
  getAppManifests().forEach(manifest => {
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
  getAppRoutes,
};
