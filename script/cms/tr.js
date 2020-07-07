/**
 * Transform the nodes passed in using the field-level transformers.
 */

/* eslint-disable no-console */

const path = require('path');
const fs = require('fs-extra');
const commandLineArgs = require('command-line-args');

const cmsoutDir = './cmsout'; // where we save our output
const graphqloutDir = './graphqlout'; // where we save our output

const {
  readEntity,
} = require('../../src/site/stages/build/process-cms-exports/helpers');
const transformFields = require('../../src/site/stages/build/process-cms-exports/transform-fields');

const optionDefinitions = [
  { name: 'files', type: String, multiple: true, defaultOption: true },
  { name: 'graphql', alias: 'a', type: Boolean }, // Handle all nodes in graphql dir
  { name: 'save', alias: 's', type: Boolean }, // Save the result to a file
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

if (!cliOptions.files && !cliOptions.graphql) {
  console.log('Please specify one or more CMS export files to transform.');
  console.log('Or --graphql to transform all of the ones in the graphql dir');
  process.exit(1);
}

const schemas = fs.readJsonSync(cliOptions.schema);
const exportDir = cliOptions['export-dir'];

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

  /*
  * Load a bunch of nodes and process them
   * @param {array[string]} The list of files we're processing
  */
function handleFiles(files) {
  files.map(fileName => {
    const [baseType, uuid] = path.basename(fileName).split('.');
    const entity = readEntity(exportDir, baseType, uuid);
    if (bundleTypeIgnoreList.has(entity.contentModelType)) {
      return undefined;
    }
    const result = transformFields(entity, rekeyedSchemas, exportDir);

  let prettyOutJson = JSON.stringify(result, null, 2);
  if (cliOptions.save) {
    let fileName = `${cmsoutDir}/${uuid}.json`;
    fs.writeFileSync(fileName, result);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
  });
}

function handleGraphqlFiles() {
  // get the list of node ids that graphql created
  let files = fs.readdirSync(graphqloutDir).filter(file => file.startsWith('node.'));
  let graphqlFileObj = {};
  files.map(file => {
    const [node, id] = path.basename(file).split('.');
    graphqlFileObj[id] = id;
  });

  // Now go over all the nodes in the cms export dir and find these ids
    const nodeDir = exportDir;
    let nodeFiles = fs.readdirSync(nodeDir).filter(file => file.startsWith('node.'));
    nodeFiles.map(file => {
      const nodePath = `${nodeDir}/${file}`;
      const rawContent = fs.readFileSync(nodePath);
      const node = JSON.parse(rawContent);
      const nid = node.nid[0].value;
      if (graphqlFileObj[nid]) {
        graphqlFileObj[nid] = null;
        const [baseType, uuid] = path.basename(nodePath).split('.');
        const entity = readEntity(exportDir, baseType, uuid);
        if (bundleTypeIgnoreList.has(entity.contentModelType)) {
          return undefined;
        }
        let result = '';
        try { //TODO why are we failing here?
          result = transformFields(entity, rekeyedSchemas, exportDir);
        } catch (err) {
          console.error(err);
        }
        let cmsName = `${cmsoutDir}/node.${nid}.json`;
        console.log(cmsName);
        let prettyOutJson = JSON.stringify(result, null, 2);
        fs.writeFileSync(cmsName, prettyOutJson);
      }
    });

    // Show the list of nodes we didn't find that graphql generated
    Object.keys(graphqlFileObj).forEach(function(key, idx) {
      if(graphqlFileObj[key] !== null) {
        console.error(`Did not find node with nid: ${key}`)
      }
    }); 
}

if (cliOptions.files) {
  handleFiles(cliOptions.files);
} else {
  handleGraphqlFiles();
}
