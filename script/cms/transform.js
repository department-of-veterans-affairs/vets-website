/**
 * Transform the nodes passed in using the field-level transformers.
 */

/* eslint-disable no-console */

const path = require('path');
const fs = require('fs-extra');
const commandLineArgs = require('command-line-args');

const {
  readEntity,
} = require('../../src/site/stages/build/process-cms-exports/helpers');
const transformFields = require('../../src/site/stages/build/process-cms-exports/transform-fields');

const optionDefinitions = [
  { name: 'files', type: String, multiple: true, defaultOption: true },
  {
    name: 'export-dir',
    type: String,
    defaultValue: path.resolve(
      __dirname,
      '../../.cache/localhost/cms-export-content',
    ),
  },
  {
    name: 'schema',
    type: String,
    defaultValue: path.resolve(__dirname, '../../../bundles.json'),
  },
];

const cliOptions = commandLineArgs(optionDefinitions);

if (!cliOptions.files) {
  console.log('Please specify one or more CMS export files to transform.');
  process.exit(1);
}

const schemas = fs.readJsonSync(cliOptions.schema);

const schemaTypeMap = {
  'Content type': 'node',
  'Custom block type': 'block_content',
  'Media type': 'media',
  'Paragraph type': 'paragraph',
  Vocabulary: 'taxonomy_term',
};

// Re-key the schemas to use the content model type name
const rekeyedSchemas = Object.values(schemas).reduce(
  (result, currentSchema) => {
    const baseType = schemaTypeMap[currentSchema.Type];
    const subType = currentSchema['Machine name'];
    const bundleName = [baseType, subType].join('-');

    return Object.assign({}, result, {
      [bundleName]: currentSchema,
    });
  },
  {},
);

/**
 * Don't try transforming these bundles; we have no schema for them.
 */
const bundleTypeIgnoreList = new Set(['node-person_profile']);

const result = cliOptions.files.map(fileName => {
  const [baseType, uuid] = path.basename(fileName).split('.');
  const entity = readEntity(cliOptions['export-dir'], baseType, uuid);
  if (bundleTypeIgnoreList.has(entity.contentModelType)) {
    return undefined;
  }
  return transformFields(entity, rekeyedSchemas, cliOptions['export-dir']);
});

console.log(JSON.stringify(result, null, 2));
