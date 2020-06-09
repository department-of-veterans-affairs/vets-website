/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const get = require('lodash/get');

const getOptions = require('../../src/site/stages/build/options');
const {
  shouldPullDrupal,
} = require('../../src/site/stages/build/drupal/metalsmith-drupal');
const getApiClient = require('../../src/site/stages/build/drupal/api');
const {
  getContentModelType,
  readEntity,
  toId,
} = require('../../src/site/stages/build/process-cms-exports/helpers');
const {
  validateRawEntity,
} = require('../../src/site/stages/build/process-cms-exports/schema-validation.js');

const uniqueErrors = new Map();
let errorCount = 0;

(async () => {
  const buildOptions = await getOptions(false, false);
  buildOptions['use-cms-export'] = true; // Because this is what we're testing

  // 1. Pull and untar the content from Drupal
  if (shouldPullDrupal(buildOptions)) {
    const contentApi = getApiClient(buildOptions);
    await contentApi.fetchExportContent();
  } else {
    console.log(chalk.gray('CMS export cache found'));
  }

  // 2. Get a list of all the files
  const fileNames = fs
    .readdirSync(buildOptions['cms-export-dir'])
    // 3. Filter out the ones we know we won't use
    .filter(
      name =>
        name !== 'meta' &&
        !name.startsWith('redirect') &&
        !name.startsWith('path_alias'),
    );

  // 4. Iterate over each remaining file to:
  fileNames.forEach(name => {
    // Used in getContentModelType
    // This is usually done in the normal readEntity
    const [baseType, uuid] = name.match(/^(.*)\.(.*)\.json/).slice(1, 3);

    // Open the file and determine content model type
    const entity = readEntity(buildOptions['cms-export-dir'], baseType, uuid, {
      noLog: true,
    });

    // Validate the contents using the appropriate JSON schema
    const rawErrors = validateRawEntity(entity);
    if (rawErrors.length) {
      rawErrors.forEach(e => {
        e.exampleEntityId = toId(entity);
        e.exampleData = get(entity, e.dataPath.slice(1));
        // Capture unique errors
        uniqueErrors.set(
          `${getContentModelType(entity)}: '${e.message}' at ${e.dataPath}`,
          e,
        );
        errorCount++;
      });
    }
  });

  console.log(chalk.green('Unique errors:'), uniqueErrors.size);
  console.log(chalk.green('Total errors encountered:'), errorCount);

  // Display the results
  for (const e of uniqueErrors) {
    console.log(JSON.stringify(e, null, 2));
  }
})();
