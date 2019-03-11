/* eslint-disable no-param-reassign */
require('isomorphic-fetch');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

const ENVIRONMENTS = require('../../../constants/environments');

const DRUPAL_COLORIZED_OUTPUT = chalk.rgb(73, 167, 222);

// eslint-disable-next-line no-console
const log = message => console.log(DRUPAL_COLORIZED_OUTPUT(message));

function downloadDrupalAssets(options) {
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
        const response = await fetch(asset.src);

        if (response.ok) {
          downloadCount++;
          files[asset.dest] = {
            path: asset.dest,
            isDrupalAsset: true,
            contents: await response.buffer(),
          };
          if (options.buildtype === ENVIRONMENTS.LOCALHOST) {
            fs.outputFileSync(
              path.join(options.cacheDirectory, 'drupalFiles', asset.dest),
              files[asset.dest].contents,
            );
          }
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
