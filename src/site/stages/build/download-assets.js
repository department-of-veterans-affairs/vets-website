/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

require('isomorphic-fetch');
const buckets = require('./constants/buckets');

function downloadAssets(buildOptions) {
  return async (files, smith, done) => {
    const bucket = buckets[buildOptions.buildtype];
    const fileManifestPath = 'generated/file-manifest.json';

    console.log(`Downloading assets from ${bucket}...`);

    const fileManifestRequest = await fetch(`${bucket}/${fileManifestPath}`);
    const fileManifest = await fileManifestRequest.json();

    files[fileManifestPath] = {
      path: fileManifestPath,
      contents: new Buffer(JSON.stringify(fileManifest)),
    };

    const entryNames = Object.keys(fileManifest);

    const downloads = entryNames.map(async entryName => {
      let bundleFileName = fileManifest[entryName];
      const bundleUrl = `${bucket}${bundleFileName}`;
      const bundleResponse = await fetch(bundleUrl);

      if (!bundleResponse.ok) {
        throw new Error(`Failed to download asset: ${bundleUrl}`);
      }

      if (bundleFileName.startsWith('/'))
        bundleFileName = bundleFileName.slice(1);

      files[bundleFileName] = {
        path: bundleFileName,
        contents: await bundleResponse.buffer(),
      };

      console.log(`Successfully downloaded asset: ${bundleUrl}`);
    });

    await Promise.all(downloads);
    done();
  };
}

module.exports = downloadAssets;
