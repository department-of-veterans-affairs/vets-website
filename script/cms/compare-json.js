/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const deepDiff = require('deep-diff');
const { map } = require('lodash');
const commandLineArgs = require('command-line-args');
const assembleEntityTreeFactory = require('../../src/site/stages/build/process-cms-exports');
const {
  readEntity,
} = require('../../src/site/stages/build/process-cms-exports/helpers');

const exportDir = path.resolve(
  __dirname,
  `../../.cache/localhost/cms-export-content`,
);

// Array of nodes from pages.json
const graphQL = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, `../../.cache/localhost/drupal/pages.json`),
  ),
);

const assembleEntityTree = assembleEntityTreeFactory(exportDir);

const commandLineDefs = [
  {
    name: 'entity',
    alias: 'e',
    type: String,
    multiple: true,
    description: 'Specify specific nodes) to compare.',
  },
];

const { entity: entityNames } = commandLineArgs(commandLineDefs);

/**
 * Converts deep-diff's 'kind' property
 * @param {string} kind
 */
const getDiffType = kind => {
  switch (kind) {
    case 'A':
      return 'Array Change';
    case 'D':
      return 'Property Deleted';
    case 'E':
      return 'Property Edited';
    case 'N':
      return 'New property Added';
    default:
      return 'Change';
  }
};

/**
 * Converts deep-diff's 'item' property
 * https://www.npmjs.com/package/deep-diff#differences
 * @param {object} item
 */
const getDiffItem = item => {
  const diffItem = {
    item: {
      diffType: getDiffType(item.kind),
    },
  };
  if (!item.lhs || !item.rhs) {
    return !item.lhs
      ? { ...diffItem.item, cmsExport: item.rhs }
      : { ...diffItem.item, graphQL: item.lhs };
  }
  return {};
};

/**
 * Compares two entity JSON objects
 * https://www.npmjs.com/package/deep-diff#differences
 * @param {object} baseGraphQlObject
 * @param {object} baseCmsExportObject
 */
const compareJson = (baseGraphQlObject, baseCmsExportObject) => {
  // Only compare present fields in GraphQL entity, excluding entityMetatags for now
  // Output missing fields to console
  const graphQlObject = {};
  const cmsExportObject = {};

  // Save present keys in CMS export and GraphQL objects
  // Output missing keys to console
  Object.keys(baseGraphQlObject).forEach(key => {
    if (key in baseCmsExportObject && key !== 'entityMetatags') {
      cmsExportObject[key] = baseCmsExportObject[key];
      graphQlObject[key] = baseGraphQlObject[key];
    } else if (key !== 'entityMetatags') {
      if (entityNames) console.log(`Field missing: ${key}`);
    } else {
      // Do nothing because key is 'entityMetatags'
    }
  });

  // fs.writeFileSync(
  //   path.join(__dirname, `../../graphQl.json`),
  //   JSON.stringify(baseGraphQlObject),
  // );

  // fs.writeFileSync(
  //   path.join(__dirname, `../../cmsexport.json`),
  //   JSON.stringify(baseCmsExportObject),
  // );

  // Get array of differences. Exclude new properties because transformed
  // CMS objects may have additional properties
  return deepDiff(graphQlObject, cmsExportObject)
    ?.filter(d => d.kind !== 'N')
    .map(diff => {
      return {
        diffType: getDiffType(diff.kind),
        path: diff.index
          ? `${diff.path.join('/')}[${diff.index}]`
          : diff.path.join('/'),
        ...(diff.item && { item: getDiffItem(diff.item) }),
        ...(diff.lhs && { graphQL: diff.lhs }),
        ...(diff.rhs && { cmsExport: diff.rhs }),
      };
    });
};

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

    // Find GraphQL object from pages.json data
    const baseObject = graphQL.data.nodeQuery.entities.filter(
      e =>
        e.entityBundle === rawEntities[0].entityBundle &&
        parseInt(e.entityId, 10) === rawEntities[0].nid[0].value,
    )[0];

    if (baseObject) {
      const diff = compareJson(baseObject, transformedEntities[0]);
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
      console.log('Node not present in .cache/localhost/drupal/pages.json');
    }
  } else {
    let fileNames = fs
      .readdirSync(exportDir)
      .filter(fn => fn !== 'meta')
      .map(name => name.split('.').slice(0, 2));

    // if (!bundle) {
    fileNames = fileNames.filter(([baseType]) => baseType === 'node');
    // }

    const rawEntities = map(fileNames, entityDetails =>
      readEntity(exportDir, ...entityDetails),
    );

    // Get only published nodes
    const transformedEntities = map(rawEntities, entity =>
      assembleEntityTree(entity, false),
    ).filter(e => e);

    // console.log(rawEntities.length);
    // console.log(transformedEntities.length);

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
        if (diff) {
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
      } else {
        // console.log('Node not present in .cache/localhost/drupal/pages.json');
      }
    });
    console.log(
      diffNum === 0
        ? `No differences found!`
        : `${diffNum}/${totalObjectsCompared} nodes with differences: './content-object-diffs'`,
    );
  }
};

runComparison();
