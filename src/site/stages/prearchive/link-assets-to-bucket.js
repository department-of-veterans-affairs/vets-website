/**
 * This build step prefixes each reference to a local static asset (JS, CSS, images, etc.) with the S3 bucket.
 * By directly referencing the bucket instead of a local reference, we bypass the domain and lift some weight off the network.
 *
 * This step had to be done after integration tests, because the static assets have not been uploaded to the S3 bucket yet.
 */

/* eslint-disable no-continue */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const buckets = require('../../constants/buckets');

const TEAMSITE_ASSETS = 'va_files';

function getAssetLinkElements(doc) {
  const elementTags = 'script, img, link, picture > source';
  return doc(elementTags);
}

function invalidAssetSrcCheck(assetSrc) {
  return (
    !assetSrc ||
    assetSrc.startsWith('http') ||
    assetSrc.startsWith('data:') ||
    assetSrc.includes(TEAMSITE_ASSETS)
  );
}

function updateAssetBucketLocation(prop, assetSrc, item, bucketPath) {
  let assetBucketLocation;
  if (prop === 'srcset') {
    const sources = assetSrc.split(',');
    assetBucketLocation = sources
      .map(src => `${bucketPath}${src.trim()}`)
      .join(', ');
  } else {
    assetBucketLocation = `${bucketPath}${assetSrc}`;
  }
  item.attr(prop, assetBucketLocation);
}

function updateSrcPaths(doc, element, bucketPath) {
  const item = doc(element);
  const possibleSrcProps = ['src', 'href', 'data-src', 'srcset'];
  possibleSrcProps.forEach(prop => {
    const assetSrc = item.attr(prop);
    const isInvalidAssetSrc = invalidAssetSrcCheck(assetSrc);
    if (!isInvalidAssetSrc) {
      updateAssetBucketLocation(prop, assetSrc, item, bucketPath);
    }
  });
}

function linkAssetsToBucket(options, fileNames) {
  console.log('---------------linkAssetsToBucket------------------');
  console.time('linkAssets');
  const bucketPath = buckets[options.buildtype];

  // Heroku deployments (review instances) won't have a bucket.
  if (!bucketPath) return;

  const htmlFileNames = fileNames.filter(
    file => path.extname(file) === '.html',
  );

  for (const htmlFileName of htmlFileNames) {
    const htmlFile = fs.readFileSync(htmlFileName);

    const doc = cheerio.load(htmlFile);

    const assetLinkElements2 = getAssetLinkElements(doc);

    assetLinkElements2.each((i, element) => {
      updateSrcPaths(doc, element, bucketPath);
    });

    const newContents2 = new Buffer(doc.html());
    fs.writeFileSync(htmlFileName, newContents2);
  }

  const cssFileNames = fileNames.filter(file => path.extname(file) === '.css');
  const cssUrlRegex = new RegExp(/url\(\/(?!(va_files))/, 'g');
  const cssUrlBucket = `url(${bucketPath}/`;

  for (const cssFileName of cssFileNames) {
    const cssFile = fs.readFileSync(cssFileName);
    const css = cssFile.toString();

    const newCss = css.replace(cssUrlRegex, cssUrlBucket);

    fs.writeFileSync(cssFileName, newCss);
  }

  // The proxy-rewrite is a special case.
  const proxyRewriteFileName = fileNames.find(file =>
    file.endsWith('proxy-rewrite.entry.js'),
  );
  const proxyRewriteContents = fs.readFileSync(proxyRewriteFileName);
  const newProxyRewriteContents = proxyRewriteContents
    .toString()
    .replace(/https:\/\/www\.va\.gov\/img/g, `${bucketPath}/img`);

  fs.writeFileSync(proxyRewriteFileName, newProxyRewriteContents);
  console.timeEnd('linkAssets');
}

module.exports = linkAssetsToBucket;
