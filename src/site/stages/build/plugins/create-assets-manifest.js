/* eslint-disable no-param-reassign, no-continue */
const fs = require('fs-extra');
const path = require('path');

const vagovContentRepo =
  'https://github.com/department-of-veterans-affairs/vagov-content/tree/master/assets';
const vetsWebsiteRepo =
  'https://github.com/department-of-veterans-affairs/vets-website/tree/master/src/site/assets';

const mimeTypes = new Map([
  ['.png', 'image/png'],
  ['.jpg', 'image/jpg'],
  ['.jpeg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.pdf', 'application/pdf'],
  ['.txt', 'text/plain'],
  ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'],
  ['.eot', 'font/eot'],
  ['.woff', 'font/woff'],
  ['.svg', 'image/svg+xml'],
  ['.ics', 'text/calendar'],
  ['.js', 'text/javascript'],
]);

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
          internalUrl = `${vagovContentRepo}/${fileName}`;
        } else {
          internalUrl = `${vetsWebsiteRepo}/${fileName}`;
        }
      }

      const assetData = {
        fileName: filePath.base,
        fileSize: file.contents.byteLength,
        fileType: mimeTypes.get(filePath.ext),
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
