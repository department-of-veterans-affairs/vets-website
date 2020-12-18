/* eslint-disable no-console */

const fs = require('fs-extra');
const path = require('path');

const getOptions = require('../src/site/stages/build/options');
const getDrupalClient = require('../src/site/stages/build/drupal/api');

const USE_CMS_EXPORT_BUILD_ARG = 'use-cms-export';
const CMS_EXPORT_DIR_BUILD_ARG = 'cms-export-dir';
const DRUPAL_CACHE_FILENAME = 'drupal/pages.json';

(async () => {
  const defautOptions = await getOptions();

  const options = {
    ...defautOptions,
    'no-drupal-proxy': true,
    'pull-drupal': true,
  };

  let drupalPages = {};

  try {
    const contentApi = getDrupalClient(options);
    console.log('Fetching Drupal content...');
    drupalPages = await contentApi.getAllPages();
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
})();
