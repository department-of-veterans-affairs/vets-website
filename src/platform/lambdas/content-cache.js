/* eslint-disable no-console */

const fs = require('fs-extra');
const path = require('path');

const getOptions = require('../../site/stages/build/options');
const getDrupalClient = require('../../site/stages/build/drupal/api');

const USE_CMS_EXPORT_BUILD_ARG = 'use-cms-export';
const CMS_EXPORT_DIR_BUILD_ARG = 'cms-export-dir';
const DRUPAL_CACHE_FILENAME = 'drupal/pages.json';

exports.handler = async function(event, context) {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const options = await getOptions({
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

  const drupalCache = options[USE_CMS_EXPORT_BUILD_ARG]
    ? options[CMS_EXPORT_DIR_BUILD_ARG]
    : path.join(options.cacheDirectory, DRUPAL_CACHE_FILENAME);

  fs.outputJsonSync(drupalCache, drupalPages, { spaces: 2 });

  return true;
};
