function getWebpackEntryPoints(manifests) {
  return manifests.reduce((apps, next) => {
    // eslint-disable-next-line no-param-reassign
    apps[next.entryName] = next.entryFile;
    return apps;
  }, {});
}

module.exports.getWebpackEntryPoints = getWebpackEntryPoints;
