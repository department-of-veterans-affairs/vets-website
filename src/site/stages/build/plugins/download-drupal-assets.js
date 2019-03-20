/* eslint-disable no-param-reassign */
require('isomorphic-fetch');
const path = require('path');
const fs = require('fs-extra');

const ENVIRONMENTS = require('../../../constants/environments');
const DRUPALS = require('../../../constants/drupals');
const { logDrupal: log } = require('../drupal/utilities-drupal');
const getDrupalClient = require('../drupal/api');

function replaceWithInternalUrl(url) {
  const [internal, external] = Object.entries(DRUPALS.PUBLIC_URLS).find(entry =>
    url.startsWith(entry[1]),
  );

  return url.replace(external, internal);
}

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
        let srcUrl = asset.src;
        // if we're not using the proxy, then we're using internal urls
        // and we need to convert the cms.va.gov urls from Drupal into
        // internal ones for downloading
        if (!client.usingProxy) {
          srcUrl = replaceWithInternalUrl(asset.src);
        }

        const response = await client.proxyFetch(srcUrl);

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
