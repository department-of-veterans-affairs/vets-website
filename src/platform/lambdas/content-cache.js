/* eslint-disable no-console */

const path = require('path');
const stream = require('stream');

const S3 = require('aws-sdk/clients/s3'); // eslint-disable-line import/no-unresolved
const fetch = require('node-fetch');
const gz = require('gunzip-maybe');
const tar = require('tar-stream');

const getOptions = require('../../site/stages/build/options');
const getDrupalClient = require('../../site/stages/build/drupal/api');

const ASSET_REGEX = /"[^"]+(?:\.amazonaws\.com|\.cms\.va\.gov)\/(sites\/[^"]+\/files\/([^"]+))"/g;

const IMG_SUFFIXES = ['png', 'jpg', 'jpeg', 'gif', 'svg'];

const DRUPAL_ADDRESS =
  'http://internal-dsva-vagov-prod-cms-2000800896.us-gov-west-1.elb.amazonaws.com';

const S3_BUCKET = 'vetsgov-website-builds-s3-upload';
const S3_KEY = 'content-cache/master/cache.tar.gz';

exports.handler = async function(event, context) {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const options = await getOptions({
    'drupal-address': DRUPAL_ADDRESS,
    'no-drupal-proxy': true,
    'pull-drupal': true,
  });

  let drupalPages = {};

  try {
    console.log('Initializing Drupal client...');
    const contentApi = getDrupalClient(options);
    console.log('Fetching Drupal content...');
    drupalPages = await contentApi.getAllPagesViaIndividualGraphQlQueries();
    console.log('Successfully fetched Drupal content!');
  } catch (error) {
    console.error('Failed to fetch Drupal content.');
    throw new Error(error);
  }

  if (drupalPages.errors && drupalPages.errors.length) {
    console.log(JSON.stringify(drupalPages.errors, null, 2));
    throw new Error('Drupal query returned with errors');
  }

  console.log('Stringifying the data...');
  const pagesString = JSON.stringify(drupalPages, null, 2);

  console.log('Creating tar file in memory...');
  const passThroughStream = new stream.PassThrough();
  const tarball = tar.pack();
  tarball.entry({ name: 'cache', type: 'directory' });
  tarball.entry({ name: 'cache/pages.json' }, pagesString);
  tarball.entry({ name: 'cache/downloads/files', type: 'directory' });
  tarball.entry({ name: 'cache/downloads/img', type: 'directory' });

  console.log('Downloading assets...');
  const assetIterator = drupalPages.matchAll(ASSET_REGEX);
  const assetPaths = new Set();
  const assetDownloads = [];

  for (const [, relativePath, filePath] of assetIterator) {
    if (!assetPaths.has(relativePath)) {
      assetPaths.add(relativePath);
      const assetUrl = new URL(relativePath, DRUPAL_ADDRESS).toString();

      assetDownloads.push(
        fetch(assetUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch asset ${assetUrl}: ${response.statusText}`,
              );
            }

            return response.buffer();
          })
          .then(data => {
            const isImg = IMG_SUFFIXES.some(ext =>
              assetUrl.toLowerCase().endsWith(ext),
            );

            const archivePath = path.join(
              'cache/downloads',
              isImg ? 'img' : 'files',
              filePath,
            );

            tarball.entry({ name: archivePath }, data);
            console.log('Archived asset at', archivePath);
          })
          .catch(console.error),
      );
    }
  }

  await Promise.all(assetDownloads);
  console.log('Done downloading assets.');

  console.log('Archiving and compressing the cache...');
  tarball.finalize();
  tarball.pipe(gz()).pipe(passThroughStream);

  console.log('Uploading the cache...');
  const s3 = new S3();
  const request = s3.upload({
    Body: passThroughStream,
    Bucket: S3_BUCKET,
    Key: S3_KEY,
  });

  let response = null;

  try {
    response = await request.promise();
    console.log('Successfully uploaded the cache!');
  } catch (error) {
    console.error('Failed to upload the cache.');
    throw new Error(error);
  }

  return response;
};
