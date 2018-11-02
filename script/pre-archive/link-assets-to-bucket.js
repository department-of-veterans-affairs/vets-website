/**
 * This build step prefixes each reference to a local static asset (JS, CSS, images, etc.) with the S3 bucket.
 * By directly referencing the bucket instead of a local reference, we bypass the domain and lift some weight off the network.
 *
 * This step had to be done after integration tests, because the static assets have not been uploaded to the S3 bucket yet.
 */

/* eslint-disable no-continue */

const fs = require('fs');
const jsdom = require('jsdom');
const path = require('path');
const buckets = require('../constants/buckets');

function linkAssetsToBucket(options, fileNames) {
  const bucketPath = buckets[options.buildtype];

  // Heroku deployments (review instances) won't have a bucket.
  if (!bucketPath) return;

  const htmlFileNames = fileNames.filter(
    file => path.extname(file) === '.html',
  );

  for (const htmlFileName of htmlFileNames) {
    const htmlFile = fs.readFileSync(htmlFileName);
    const dom = new jsdom.JSDOM(htmlFile.toString());

    const assetLinkElements = Array.from(
      dom.window.document.querySelectorAll('script, img, link'),
    );

    for (const element of assetLinkElements) {
      let assetSrcProp = 'src';
      let assetSrc = element.getAttribute(assetSrcProp);

      if (!assetSrc) {
        assetSrcProp = 'href';
        assetSrc = element.getAttribute(assetSrcProp);
      }

      if (!assetSrc) {
        assetSrcProp = 'data-src';
        assetSrc = element.getAttribute(assetSrcProp);
      }

      if (!assetSrc) continue;
      if (assetSrc.startsWith('http')) continue;

      const assetBucketLocation = `${bucketPath}${assetSrc}`;

      element.setAttribute(assetSrcProp, assetBucketLocation);
    }

    const newContents = new Buffer(dom.serialize());

    fs.writeFileSync(htmlFileName, newContents);
    dom.window.close();
  }

  const cssFileNames = fileNames.filter(file => path.extname(file) === '.css');
  const cssUrlRegex = new RegExp(/url\(\//, 'g');
  const cssUrlBucket = `url(${bucketPath}/`;

  for (const cssFileName of cssFileNames) {
    const cssFile = fs.readFileSync(cssFileName);
    const css = cssFile.toString();

    const newCss = css.replace(cssUrlRegex, cssUrlBucket);

    fs.writeFileSync(cssFileName, newCss);
  }
}

module.exports = linkAssetsToBucket;
