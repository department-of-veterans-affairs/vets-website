const fs = require('fs');
const Diff = require('diff');
const path = require('path');
const { map } = require('lodash');
const assert = require('assert').strict;
const diff = require('deep-diff');

const assembleEntityTreeFactory = require('../../src/site/stages/build/process-cms-exports');
const {
  readEntity,
} = require('../../src/site/stages/build/process-cms-exports/helpers');

const exportDir = path.resolve(
  __dirname,
  `../../.cache/localhost/cms-export-content`,
);

const graphQL = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, `../../.cache/localhost/drupal/pages.json`),
  ),
);

const assembleEntityTree = assembleEntityTreeFactory(exportDir);

const fileNames = fs
  .readdirSync(exportDir)
  .filter(fn => fn !== 'meta')
  .map(name => name.split('.').slice(0, 2));

let entities = map(fileNames.slice(0, fileNames.length), entityDetails =>
  readEntity(exportDir, ...entityDetails),
);

// Filtering node-health_care_local_facility entities for testing purposes
entities = entities.filter(
  'node-health_care_local_facility'.includes('-')
    ? e => e.contentModelType === 'node-health_care_local_facility'
    : e =>
        e.contentModelType.split('-')[1] === 'node-health_care_local_facility',
);

// Transformed entities
const modifiedEntities = map(entities, entity =>
  assembleEntityTree(entity, false),
).filter(e => e);

// Using the GraphQL entity equivalent to the first element in the modifiedEntities array for testing purposes
const oldObj = graphQL.data.nodeQuery.entities.filter(
  e => e.entityBundle === 'health_care_local_facility' && e.entityId === '84',
)[0];

// Only get fields present in GraphQL entity, excluding entityMetatags for now
const cmsExportObject = {};
const graphQlObject = {};

Object.keys(oldObj).forEach(key => {
  if (modifiedEntities[0][key] && key !== 'entityMetatags') {
    cmsExportObject[key] = modifiedEntities[0][key];
    graphQlObject[key] = oldObj[key];
  }
});

fs.writeFileSync(
  path.join(__dirname, `../../export-comparison.json`),
  JSON.stringify(diff(cmsExportObject, graphQlObject)),
);

// function isObject(object) {
//   return object != null && typeof object === 'object';
// }

// function deepEqual(object1, object2) {
//   const keys1 = Object.keys(object1);
//   const keys2 = Object.keys(object2);

//   if (keys1.length !== keys2.length) {
//     return false;
//   }

//   for (const key of keys1) {
//     const val1 = object1[key];
//     const val2 = object2[key];
//     const areObjects = isObject(val1) && isObject(val2);
//     if (
//       (areObjects && !deepEqual(val1, val2)) ||
//       (!areObjects && val1 !== val2)
//     ) {
//       return false;
//     }
//   }

//   return true;
// }

// const diff = Diff.diffJson(graphQlObject, cmsExportObject);

// let Num = 0;

// diff.forEach(part => {
//   if (part.removed) console.log(part);
//   if (part.removed) Num++;
// });
// console.log('Differences:', Num);
