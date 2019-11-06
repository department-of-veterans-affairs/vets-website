// Dependencies
const { map } = require('lodash');
// Relative
const assembleEntityTree = require('../src/site/stages/build/process-cms-exports');
const {
  readAllNodeNames,
  readEntity,
} = require('../src/site/stages/build/process-cms-exports/helpers');

const fileNames = readAllNodeNames();
const entities = map(fileNames, entityDetails => readEntity(...entityDetails));
const modifiedEntities = map(entities, entity => assembleEntityTree(entity));

// eslint-disable-next-line
console.log('Number of files:', modifiedEntities.length);
// console.log('First node:', modifiedEntities[0]);
