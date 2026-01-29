/* eslint-disable no-console */
const find = require('find');
const path = require('path');

const root = path.join(__dirname, '..');

function getAppManifests() {
  return find
    .fileSync(/manifest\.(json|js)$/, path.join(root, './src/applications'))
    .filter(p => !p.includes('node_modules'))
    .map(file => {
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
    // Merge manifest's dependOn with default ['vendor']
    const defaultDependOn = ['vendor'];
    const manifestDependOn = next.dependOn || [];
    const mergedDependOn = [
      ...defaultDependOn,
      ...manifestDependOn.filter(dep => !defaultDependOn.includes(dep)),
    ];

    // eslint-disable-next-line no-param-reassign
    apps[next.entryName] = {
      import: next.entryFile,
      dependOn:
        mergedDependOn.length === 1 ? mergedDependOn[0] : mergedDependOn,
    };
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
