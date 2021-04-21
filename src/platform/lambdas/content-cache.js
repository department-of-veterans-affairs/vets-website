/* eslint-disable no-console */

const path = require('path');
const stream = require('stream');

const S3 = require('aws-sdk/clients/s3'); // eslint-disable-line import/no-unresolved
const fetch = require('node-fetch').default;
const gz = require('gunzip-maybe');
const tar = require('tar-stream');

const getOptions = require('../../site/stages/build/options');
const getDrupalClient = require('../../site/stages/build/drupal/api');

const ASSET_REGEX = /"https?:\/\/[^"]+(?:\.amazonaws\.com|\.cms\.va\.gov)\/(sites\/[^"]+\/files\/([^"\\]+))\\?"/g;

const IMG_SUFFIXES = ['png', 'jpg', 'jpeg', 'gif', 'svg'];

const DRUPAL_ADDRESS =
  'http://internal-dsva-vagov-prod-cms-2000800896.us-gov-west-1.elb.amazonaws.com';

const S3_BUCKET = 'vetsgov-website-builds-s3-upload';
const S3_KEY = 'content-cache/master/cache.tar.gz';

/* eslint-disable no-await-in-loop */
const downloader = (queue, tarball) => async resolve => {
  while (queue.length) {
    const { src, dest } = queue.shift();
    const response = await fetch(src);
    if (!response.ok) console.error(`Failed to fetch asset at ${src}.`);
    const data = await response.buffer();
    tarball.entry({ name: dest }, data);
  }
  resolve();
};
/* eslint-enable no-await-in-loop */

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
  const assetIterator = pagesString.matchAll(ASSET_REGEX);
  const assetPaths = new Set();
  const assetQueue = [];

  for (const [, relativePath, filePath] of assetIterator) {
    if (!assetPaths.has(relativePath)) {
      assetPaths.add(relativePath);

      const assetUrl = new URL(relativePath, DRUPAL_ADDRESS);
      assetUrl.search = '';

      const downloadPath = filePath.split('?', 2)[0];

      const isImg = IMG_SUFFIXES.some(ext =>
        downloadPath.toLowerCase().endsWith(ext),
      );

      const archivePath = path.join(
        'cache/downloads',
        isImg ? 'img' : 'files',
        downloadPath,
      );

      assetQueue.push({
        src: assetUrl,
        dest: archivePath,
      });
    }
  }

  const assetDownloaders = new Array(5)
    .fill(null)
    .map(() => new Promise(downloader(assetQueue, tarball)));

  await Promise.all(assetDownloaders);
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
