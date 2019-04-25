/* eslint-disable no-param-reassign, no-continue */
const fs = require('fs-extra');
const path = require('path');

const vetsWebsiteRepo =
  'https://github.com/department-of-veterans-affairs/vagov-content/tree/master/assets';
const vagovContentRepo =
  'https://github.com/department-of-veterans-affairs/vets-website/tree/master/src/site/assets';

function createAssetsManifest(buildOptions) {
  return (files, smith, done) => {
    const { hostUrl } = buildOptions;
    const vagovContentAssetsRoot = smith.path(
      buildOptions.contentAssets.source,
    );
    const assetsManifest = [];

    for (const fileName of Object.keys(files)) {
      const filePath = path.parse(fileName);
      const file = files[fileName];

      if (filePath.ext === '.html') continue;
      if (fileName.startsWith('generated')) continue;

      let internalUrl = file.internalUrl;

      if (!file.isDrupalAsset) {
        const vagovContentPath = path.join(vagovContentAssetsRoot, fileName);
        const isInVagovContent = fs.existsSync(vagovContentPath);

        if (isInVagovContent) {
          internalUrl = `${vetsWebsiteRepo}/${fileName}`;
        } else {
          internalUrl = `${vagovContentRepo}/${fileName}`;
        }
      }

      const assetData = {
        fileName: filePath.base,
        fileSize: file.contents.byteLength,
        url: `${hostUrl}/${fileName}`,
        internalUrl,
      };

      assetsManifest.push(assetData);
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
