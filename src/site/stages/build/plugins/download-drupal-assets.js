/* eslint-disable no-param-reassign */
require('isomorphic-fetch');
const cheerio = require('cheerio');
const chalk = require('chalk');

const getDrupalClient = require('../drupal/api');

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

function updateAttr(attr, doc, client) {
  const assetsToDownload = [];
  doc(`[${attr}^="${client.getSiteUri()}/sites"]`).each((i, el) => {
    const item = doc(el);
    const srcAttr = item.attr(attr);
    const newAssetPath = convertAssetPath(client.getSiteUri(), srcAttr);
    assetsToDownload.push({
      src: srcAttr,
      dest: newAssetPath,
    });

    item.attr('src', `/${newAssetPath}`);
  });

  return assetsToDownload;
}

function downloadDrupalAssets(options) {
  const drupalClient = getDrupalClient(options);

  return async (files, metalsmith, done) => {
    let assetsToDownload = [];

    for (const fileName of Object.keys(files)) {
      const file = files[fileName];
      let fileUpdated = false;

      if (file.isDrupalPage && fileName.endsWith('html')) {
        const doc = cheerio.load(file.contents);

        const srcAssets = updateAttr('src', doc, drupalClient);
        if (srcAssets.length) fileUpdated = true;
        assetsToDownload = assetsToDownload.concat(srcAssets);

        const dataSrcAssets = updateAttr('data-src', doc, drupalClient);
        if (dataSrcAssets.length) fileUpdated = true;
        assetsToDownload = assetsToDownload.concat(dataSrcAssets);

        const hrefAssets = updateAttr('href', doc, drupalClient);
        if (hrefAssets.length) fileUpdated = true;
        assetsToDownload = assetsToDownload.concat(hrefAssets);

        // eslint-disable-next-line no-loop-func
        doc(`[srcset*="${drupalClient.getSiteUri()}/sites"]`).each((i, el) => {
          fileUpdated = true;
          const item = doc(el);
          const srcAttr = item.attr('srcset');
          const sources = srcAttr.split(',');
          const newPaths = [];
          sources.forEach(source => {
            const [url, size] = source.split(' ', 2);
            const newAssetPath = convertAssetPath(
              drupalClient.getSiteUri(),
              url,
            );
            assetsToDownload.push({
              src: url,
              dest: newAssetPath,
            });
            newPaths.push(`/${newAssetPath} ${size}`);
          });

          item.attr('srcset', newPaths.join(','));
        });

        if (fileUpdated) {
          file.contents = new Buffer(doc.html());
        }
      }
    }

    if (assetsToDownload.length) {
      let downloadCount = 0;
      let errorCount = 0;
      const downloads = assetsToDownload.map(async asset => {
        if (!files[asset.dest]) {
          const response = await fetch(asset.src);

          if (response.ok) {
            downloadCount++;
            files[asset.dest] = {
              path: asset.dest,
              isDrupalAsset: true,
              contents: await response.buffer(),
            };
          } else {
            errorCount++;
            log(`Image download failed: ${response.statusText}: ${asset.src}`);
          }
        }
      });

      await Promise.all(downloads);
      log(`Downloaded ${downloadCount} asset(s) from Drupal`);
      log(`${errorCount} error(s) downloading assets`);
    }

    done();
  };
}

module.exports = downloadDrupalAssets;
