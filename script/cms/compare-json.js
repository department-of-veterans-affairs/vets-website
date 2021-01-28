/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const deepDiff = require('deep-diff');
const { map, camelCase } = require('lodash');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const assembleEntityTreeFactory = require('../../src/site/stages/build/process-cms-exports');
const {
  readEntity,
} = require('../../src/site/stages/build/process-cms-exports/helpers');

const commandLineDefs = [
  {
    name: 'entity',
    alias: 'e',
    type: String,
    multiple: true,
    description: 'Specify the specific node entity to compare.',
  },
  {
    name: 'bundle',
    type: String,
    description:
      'Compare all entities of the bundle type specified. (Only node entities are supported) i.e. node-q_a, node-health_care_local_facility, etc',
    multiple: true,
  },
  {
    name: 'help',
    type: Boolean,
    description: 'Show this help menu.',
  },
  {
    name: 'buildtype',
    type: String,
    description: 'The buildtype to test the data against.',
    defaultValue: 'localhost',
  },
];

const { entity: entityNames, bundle, help, buildtype } = commandLineArgs(
  commandLineDefs,
);

if (help) {
  console.log(
    commandLineUsage([
      {
        header: 'Content Build JSON Comparison',
        content:
          'Compare the output of GraphQL and transformed CMS export data',
      },
      {
        header: 'Options',
        optionList: commandLineDefs,
      },
    ]),
  );
  process.exit(0);
}

const exportDir = path.resolve(
  __dirname,
  `../../.cache/${buildtype}/cms-export-content`,
);

// Array of nodes from pages.json
const graphQL = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, `../../.cache/${buildtype}/drupal/pages.json`),
  ),
);

const assembleEntityTree = assembleEntityTreeFactory(exportDir);

/**
 * Converts deep-diff's 'kind' property
 * @param {string} kind - The string representing the kind of difference
 * @return {string} Description of the kind of difference
 */
const getDiffType = diff => {
  switch (diff.kind) {
    case 'A':
      return 'Array Change';
    case 'D':
      return 'Property Missing';
    case 'E':
      return typeof diff.lhs !== 'undefined' && typeof diff.rhs !== 'undefined'
        ? 'Property Edited'
        : 'Property Missing';
    case 'N':
      return 'New property Added';
    default:
      return 'Change';
  }
};

/**
 * Converts deep-diff's 'item' property
 * https://www.npmjs.com/package/deep-diff#differences
 * @param {object} item - A deep-diff 'item' object
 * @return {object} A modified deep-diff 'item' object
 */
const getDiffItem = item => {
  const diffItem = {
    item: {
      diffType: getDiffType(item),
    },
  };
  if (!('lhs' in item) || !('rhs' in item)) {
    return !('lhs' in item)
      ? { ...diffItem.item, cmsExport: item.rhs }
      : { ...diffItem.item, graphQL: item.lhs };
  }
  return {};
};

/**
 * Finds the parent node and path in ancestor node(s)
 * of non node entities. Only some paragraph entities are
 * currently supported
 * @param {object} node - The node to find the parent of
 * @param {object []} rawEntities - Array of raw entities
 * @param {object} parent - The object containing the path and parent node
 * @return {array} The finalized array containing the path and parent object of the node
 */
const getParentNode = (
  node,
  rawEntities,
  parent = { path: '', node: null },
) => {
  if (node.baseType === 'node') {
    // eslint-disable-next-line no-param-reassign
    parent.node = node;
  }

  if (parent.path === '') {
    if (node.parent_type[0].value === 'node') {
      // eslint-disable-next-line no-param-reassign
      parent.path += node.parent_field_name[0].value;
      const ent = rawEntities.find(entity => {
        const isSameId =
          parseInt(entity.nid[0].value, 10) ===
          parseInt(node.parent_id[0].value, 10);
        return entity.baseType === 'node' && isSameId;
      });
      getParentNode(ent, rawEntities, parent);
    }
  } else {
    // TODO: Add support for deeper nested paragraphs, and other entity types
  }
  return parent;
};

/**
 * Compares two entity JSON objects
 * https://www.npmjs.com/package/deep-diff#differences
 * @param {object} baseGraphQlObject - The graphQL object to compare
 * @param {object} baseCmsExportObject - The transformed CMS export object to compare
 * @return {object []} The array of differences found from deep-diff'
 */
const compareJson = (baseGraphQlObject, baseCmsExportObject) => {
  // Only compare present fields in GraphQL entity, & exclude fields in keysToIgnore
  const keysToIgnore = ['entityMetatags', 'entityType'];

  // Save present keys in CMS export and GraphQL objects
  const graphQlObject = {};
  const cmsExportObject = {};

  // Output missing keys to console
  Object.keys(baseGraphQlObject).forEach(key => {
    if (key in baseCmsExportObject && !keysToIgnore.includes(key)) {
      cmsExportObject[key] = baseCmsExportObject[key];
      graphQlObject[key] = baseGraphQlObject[key];
    } else if (!keysToIgnore.includes(key)) {
      // Output missing fields to console if '--entity' flag is used
      if (entityNames) console.log(`Field missing: ${key}`);
    } else {
      // Do nothing because key is in keysToIgnore
    }
  });

  // Get array of differences. Exclude new properties because transformed
  // CMS objects may have additional properties
  return deepDiff(graphQlObject, cmsExportObject, (diffPath, key) => {
    // Filter & ignore keys in keysToIgnore
    return keysToIgnore.includes(key);
  })
    ?.filter(d => d.kind !== 'N')
    .map(diff => {
      return {
        diffType: getDiffType(diff),
        path: diff.index
          ? `${diff.path.join('/')}[${diff.index}]`
          : diff.path.join('/'),
        ...(diff.item && { item: getDiffItem(diff.item) }),
        ...('lhs' in diff && { graphQL: diff.lhs }),
        ...('rhs' in diff && { cmsExport: diff.rhs }),
      };
    });
};

/**
 * Handles running and outputting the diff based on the command line input
 */
const runComparison = () => {
  if (entityNames) {
    const rawEntities = [];
    const transformedEntities = entityNames.map(entityName => {
      const nodeNamePieces = entityName.split('.').slice(0, 2);
      assert(
        nodeNamePieces.length === 2,
        '--entity (or -e) needs to be the filename of an entity. E.g. node.<uuid>.json',
      );

      const unTransformedEntity = readEntity(exportDir, ...nodeNamePieces);
      rawEntities.push(unTransformedEntity);

      return assembleEntityTree(unTransformedEntity, false);
    });

    let graphQlObject;

    // Handle paragraph entities
    if (rawEntities[0].baseType !== 'node') {
      let fileNames = fs
        .readdirSync(exportDir)
        .filter(fn => fn !== 'meta')
        .map(name => name.split('.').slice(0, 2));

      fileNames = fileNames.filter(
        ([baseType]) => baseType === 'node' || baseType === 'paragraph',
      );

      const cmsEntities = map(fileNames, entityDetails =>
        readEntity(exportDir, ...entityDetails),
      );

      // Find parent node for paragraph object
      const parentNode = getParentNode(rawEntities[0], cmsEntities);
      const graphQlNode = graphQL.data.nodeQuery.entities.filter(
        e =>
          e.entityBundle === parentNode.node.entityBundle &&
          parseInt(e.entityId, 10) === parentNode.node.nid[0].value,
      )[0];

      // Get specific paragraph object
      graphQlObject = graphQlNode[camelCase(parentNode.path)][0];
    } else {
      // Find GraphQL object from pages.json data
      graphQlObject = graphQL.data.nodeQuery.entities.filter(
        e =>
          e.entityBundle === rawEntities[0].entityBundle &&
          parseInt(e.entityId, 10) === rawEntities[0].nid[0].value,
      )[0];
    }

    if (graphQlObject) {
      const diff = compareJson(graphQlObject, transformedEntities[0]);
      if (diff) {
        fs.writeFileSync(
          path.join(__dirname, `../../content-object-diff.json`),
          JSON.stringify(diff),
        );
        console.log(`${diff.length} differences: './content-object-diff.json'`);
      } else {
        console.log(`No differences found!`);
      }
    } else {
      console.log(`Node not present in .cache/${buildtype}/drupal/pages.json`);
    }
  } else {
    let fileNames = fs
      .readdirSync(exportDir)
      .filter(fn => fn !== 'meta')
      .map(name => name.split('.').slice(0, 2));

    fileNames = fileNames.filter(([baseType]) => baseType === 'node');

    let rawEntities = map(fileNames, entityDetails =>
      readEntity(exportDir, ...entityDetails),
    );

    if (bundle) {
      rawEntities = rawEntities.filter(e =>
        bundle.includes(e.contentModelType),
      );
    }

    // Get only published nodes
    const transformedEntities = map(rawEntities, entity =>
      assembleEntityTree(entity, false),
    ).filter(e => e);

    fs.rmdirSync('content-object-diffs', { recursive: true });
    fs.mkdirSync('content-object-diffs');

    // Keep track of number or diffs
    let diffNum = 0;
    let totalObjectsCompared = 0;

    // Compare JSON objects for each node entity
    transformedEntities.forEach(entity => {
      const baseObject = graphQL.data.nodeQuery.entities.filter(
        e =>
          e.entityBundle === entity.entityBundle &&
          parseInt(e.entityId, 10) === parseInt(entity.entityId, 10),
      )[0];
      if (baseObject) {
        const diff = compareJson(baseObject, entity);
        if (diff && diff.length !== 0) {
          // Add entity file name to diff output
          diff.unshift({
            entityFile: `node.${
              rawEntities.find(
                rawEntity =>
                  parseInt(rawEntity.nid[0].value, 10) ===
                  parseInt(entity.entityId, 10),
              ).uuid
            }.json`,
          });
          fs.writeFileSync(
            path.join(
              __dirname,
              `../../content-object-diffs/${entity.entityBundle}-${
                entity.entityId
              }.json`,
            ),
            JSON.stringify(diff),
          );
          ++diffNum;
        }
        ++totalObjectsCompared;
      }
    });

    console.log(
      diffNum === 0
        ? `No differences found in ${totalObjectsCompared} nodes!`
        : `${diffNum}/${totalObjectsCompared} nodes with differences: './content-object-diffs'`,
    );
  }
};

runComparison();
