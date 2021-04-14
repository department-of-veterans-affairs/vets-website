/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const getOptions = require('../../site/stages/build/options');
const getDrupalClient = require('../../site/stages/build/drupal/api');

const DRUPAL_ADDRESS =
  'http://internal-dsva-vagov-prod-cms-2000800896.us-gov-west-1.elb.amazonaws.com';

exports.handler = async function(event, context) {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const options = await getOptions({
    'drupal-address': DRUPAL_ADDRESS,
    'no-drupal-proxy': true,
    'pull-drupal': true,
  });

  const { cacheDirectory } = options;
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

  const pagesString = JSON.stringify(drupalPages, { spaces: 2 });
  const pagesFile = path.join(cacheDirectory, 'drupal', 'pages.json');
  fs.writeFileSync(pagesFile, pagesString);

  return pagesString;
};
