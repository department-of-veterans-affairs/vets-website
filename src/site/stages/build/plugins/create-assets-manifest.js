/* eslint-disable no-param-reassign, no-continue */
const path = require('path');

function createAssetsManifest(buildOptions) {
  return (files, smith, done) => {
    const { hostUrl } = buildOptions;
    const assetsManifest = [];

    for (const fileName of Object.keys(files)) {
      const filePath = path.parse(fileName);

      if (filePath.ext === '.html') continue;
      if (filePath.root === 'generated') continue;

      const file = files[fileName];

      assetsManifest.push({
        fid: fileName,
        url: `${hostUrl}/${fileName}`,
        fileName: filePath.base,
        fileSize: file.contents.byteLength,
        fromDrupal: file.isDrupalAsset,
      });
    }

    const assetsManifestFileName = 'generated/assets-manifest.json';

    files[assetsManifestFileName] = {
      path: assetsManifestFileName,
      contents: Buffer.from(JSON.stringify(assetsManifest, 0, 2)),
    };

    done();
  };
}

module.exports = createAssetsManifest;
