// Relative
const {
  assembleEntityTree,
} = require('../src/site/stages/build/tome-sync-page-builder');
const {
  readAllNodeNames,
  readEntity,
} = require('../src/site/stages/build/page-builder/helpers');

const files = readAllNodeNames()
  .map(entityDetails => readEntity(...entityDetails))
  .map(entity => assembleEntityTree(entity));

// eslint-disable-next-line
console.log('Number of files:', files.length);
