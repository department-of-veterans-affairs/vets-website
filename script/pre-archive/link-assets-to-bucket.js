/**
 * This build step prefixes each reference to a local static asset (JS, CSS, images, etc.) with the S3 bucket.
 * By directly referencing the bucket instead of a local reference, we bypass the domain and lift some weight off the network.
 *
 * This step had to be done after integration tests, because the static assets have not been uploaded to the S3 bucket yet.
 */

/* eslint-disable no-continue */

const fs = require('fs');
const jsdom = require('jsdom');
const buckets = require('../constants/buckets');

function linkAssetsToBucket(options, fileNames) {
  const bucketPath = buckets[options.buildtype];

  // Heroku deployments (review instances) won't have a bucket.
  if (!bucketPath) return;

  for (const fileName of fileNames) {
    const file = fs.readFileSync(fileName);
    const dom = new jsdom.JSDOM(file.toString());

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

      if (!assetSrc) continue;
      if (assetSrc.startsWith('http')) continue;

      const assetBucketLocation = `${bucketPath}${assetSrc}`;

      element.setAttribute(assetSrcProp, assetBucketLocation);
    }

    const newContents = new Buffer(dom.serialize());

    fs.writeFileSync(fileName, newContents);
    dom.window.close();
  }
}

module.exports = linkAssetsToBucket;
