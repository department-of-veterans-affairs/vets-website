/* eslint-disable no-param-reassign */
require('isomorphic-fetch');
const path = require('path');
const fs = require('fs-extra');

const { logDrupal: log } = require('../drupal/utilities-drupal');
const getDrupalClient = require('../drupal/api');

function downloadDrupalAssets(options) {
  const client = getDrupalClient(options);
  return async (files, metalsmith, done) => {
    const assetsToDownload = Object.entries(files)
      .filter(entry => entry[1].isDrupalAsset && !entry[1].contents)
      .map(([key, value]) => ({
        src: value.source,
        dest: key,
      }));

    if (assetsToDownload.length) {
      let downloadCount = 0;
      let errorCount = 0;

      const downloads = assetsToDownload.map(async asset => {
        const response = await client.proxyFetch(asset.src);

        if (response.ok) {
          downloadCount++;
          files[asset.dest] = {
            path: asset.dest,
            isDrupalAsset: true,
            contents: await response.buffer(),
          };
          fs.outputFileSync(
            path.join(options.cacheDirectory, 'drupal/downloads', asset.dest),
            files[asset.dest].contents,
          );
        } else {
          // For now, not going to fail the build for a missing asset
          // Should get caught by the broken link checker, though
          errorCount++;
          log(`Image download failed: ${response.statusText}: ${asset.src}`);
        }
      });

      await Promise.all(downloads);
      log(`Downloaded ${downloadCount} asset(s) from Drupal`);
      if (errorCount) {
        log(`${errorCount} error(s) downloading assets from Drupal`);
      }
    }

    done();
  };
}

module.exports = downloadDrupalAssets;
