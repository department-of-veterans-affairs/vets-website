/**
 * This build step prefixes each reference to a local static asset (JS, CSS, images, etc.) with the S3 bucket.
 * By directly referencing the bucket instead of a local reference, we bypass the domain and lift some weight off the network.
 *
 * This step had to be done after integration tests, because the static assets have not been uploaded to the S3 bucket yet.
 */

/* eslint-disable no-continue */

const fs = require('fs');
const path = require('path');
const buckets = require('../../constants/buckets');
const updateAssetLinkElements = require('./helpers');

function linkAssetsToBucketHTML(options, fileNames, bucketPath) {
  const teamsiteAssets = 'va_files';
  const assetLinkTags = 'script, img, link, picture > source';

  const htmlFileNames = fileNames.filter(
    file => path.extname(file) === '.html',
  );

  htmlFileNames.forEach(fileName => {
    const htmlFile = fs.readFileSync(fileName);
    const updatedFile = updateAssetLinkElements(
      htmlFile,
      assetLinkTags,
      teamsiteAssets,
      bucketPath,
    );
    const updatedFileBuffer = Buffer.from(updatedFile.html());
    fs.writeFileSync(fileName, updatedFileBuffer);
  });
}

function linkAssetsToBucketCSS(fileNames, bucketPath) {
  const cssFileNames = fileNames.filter(file => path.extname(file) === '.css');
  const cssUrlRegex = new RegExp(/url\(\/(?!(va_files))/, 'g');
  const cssUrlBucket = `url(${bucketPath}/`;

  for (const cssFileName of cssFileNames) {
    const cssFile = fs.readFileSync(cssFileName);
    const css = cssFile.toString();

    const newCss = css.replace(cssUrlRegex, cssUrlBucket);

    fs.writeFileSync(cssFileName, newCss);
  }
}

function linkAssetsToBucketProxyRewrite(fileNames, bucketPath) {
  // The proxy-rewrite is a special case.
  const proxyRewriteFileName = fileNames.find(file =>
    file.endsWith('proxy-rewrite.entry.js'),
  );
  const proxyRewriteContents = fs.readFileSync(proxyRewriteFileName);
  const newProxyRewriteContents = proxyRewriteContents
    .toString()
    .replace(/https:\/\/www\.va\.gov\/img/g, `${bucketPath}/img`);

  fs.writeFileSync(proxyRewriteFileName, newProxyRewriteContents);
}

function linkAssetsToBucket(options, fileNames) {
  const bucketPath = buckets[options.buildtype];

  // Heroku deployments (review instances) won't have a bucket.
  if (!bucketPath) return;

  linkAssetsToBucketHTML(options, fileNames, bucketPath);
  linkAssetsToBucketCSS(fileNames, bucketPath);
  linkAssetsToBucketProxyRewrite(fileNames, bucketPath);
}

module.exports = linkAssetsToBucket;
