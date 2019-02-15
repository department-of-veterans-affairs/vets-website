/* eslint-disable no-param-reassign */
require('isomorphic-fetch');
const cheerio = require('cheerio');
const getDrupalClient = require('../drupal/api');
const chalk = require('chalk');

const DRUPAL_COLORIZED_OUTPUT = chalk.rgb(73, 167, 222);

// eslint-disable-next-line no-console
const log = message => console.log(DRUPAL_COLORIZED_OUTPUT(message));

function convertAssetPath(drupalInstance, url) {
  const withoutHost = url.replace(`${drupalInstance}/sites/default/files/`, '');
  const path = withoutHost.split('?', 2)[0];

  if (
    ['png', 'jpg', 'jpeg', 'gif', 'svg'].some(ext =>
      path.toLowerCase().endsWith(ext),
    )
  ) {
    return `img/${path}`;
  }

  return `files/${path}`;
}

function downloadDrupalAssets(options) {
  const drupalClient = getDrupalClient(options);

  return async (files, metalsmith, done) => {
    const assetsToDownload = [];

    for (const fileName of Object.keys(files)) {
      const file = files[fileName];
      let fileUpdated = false;

      if (file.isDrupalPage && fileName.endsWith('html')) {
        const doc = cheerio.load(file.contents);
        doc(`[src^="${drupalClient.getSiteUri()}"]`).each((i, el) => {
          fileUpdated = true;
          const item = doc(el);
          const srcAttr = item.attr('src');
          const newAssetPath = convertAssetPath(
            drupalClient.getSiteUri(),
            srcAttr,
          );
          assetsToDownload.push({
            src: srcAttr,
            dest: newAssetPath,
          });

          item.attr('src', `/${newAssetPath}`);
        });

        if (fileUpdated) {
          file.contents = new Buffer(doc.html());
        }
      }
    }

    if (assetsToDownload.length) {
      const downloads = assetsToDownload.map(async asset => {
        if (!files[asset.dest]) {
          const response = await fetch(asset.src);

          if (response.ok) {
            files[asset.dest] = {
              path: asset.dest,
              isDrupalAsset: true,
              contents: await response.buffer(),
            };
          } else {
            done(`Image download failed: ${asset.src}`);
          }
        }
      });

      await Promise.all(downloads);
      log(`Downloaded ${downloads.length} assets from Drupal`);
    }

    done();
  };
}

module.exports = downloadDrupalAssets;
