const find = require('find');
const path = require('path');
const fs = require('fs');

function convertUrlToMarkdownPath(root, url) {
  const contentPath = path.join(root, './content/pages', url);
  if (fs.existsSync(`${contentPath}.md`)) {
    return `${contentPath}.md`.replace(path.join(root, './content/pages'), '');
  }

  return `${contentPath}/index.md`.replace(path.join(root, './content/pages'), '');
}

function getAppManifests(root) {
  const files = find.fileSync(/manifest\.json$/, path.join(root, './src/js'));
  const manifests = files
    .map(file => require(file))

  manifests.forEach(manifest => {
    if (manifest.rootUrl) {
      manifest.contentPage = convertUrlToMarkdownPath(root, manifest.rootUrl);
    }
  });

  console.log(manifests);
  return manifests;
}

function getWebpackEntryPoints(manifests) {
  return manifests.reduce((apps, next) => {
    apps[next.bundleName] = next.entryPoint;
    return apps;
  }, {});
}

getAppManifests(path.join(__dirname, '..'));

module.exports = {
  getWebpackEntryPoints,
  getAppManifests
};
