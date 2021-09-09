const find = require('find');
const path = require('path');

const root = path.join(__dirname, '../../');

function getAppManifests() {
  return find
    .fileSync(/manifest\.(json|js)$/, path.join(root, '../src/applications'))
    .map(file => {
      // eslint-disable-next-line import/no-dynamic-require
      const manifest = require(file);

      return Object.assign({}, manifest, {
        filePath: file,
        entryFile: path.resolve(
          root,
          path.join(path.dirname(file), manifest.entryFile),
        ),
      });
    });
}

module.exports.getAppManifests = getAppManifests;
