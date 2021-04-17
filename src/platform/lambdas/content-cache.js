/* eslint-disable no-console */

const stream = require('stream');
const S3 = require('aws-sdk/clients/s3'); // eslint-disable-line import/no-unresolved
const tar = require('tar-stream');
const gz = require('gunzip-maybe');

const getOptions = require('../../site/stages/build/options');
const getDrupalClient = require('../../site/stages/build/drupal/api');

const DRUPAL_ADDRESS =
  'http://internal-dsva-vagov-prod-cms-2000800896.us-gov-west-1.elb.amazonaws.com';

const S3_BUCKET = 'vetsgov-website-builds-s3-upload';
const S3_KEY = 'content-cache/master/cache.tar.gz';

const upload = async () => {
  const pass = new stream.PassThrough();
  const s3 = new S3();

  console.log('Uploading the cache...');
  const request = s3.putObject({
    Body: pass,
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

  const tarball = tar.pack();
  tarball.entry({ name: 'pages.json' }, pagesString);
  tarball.finalize();
  tarball.pipe(gz()).pipe(upload());

  return true;
};
