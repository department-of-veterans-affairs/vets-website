const assembleEntityTree = require('../src/site/stages/build/process-cms-exports');
const {
  readAllNodeNames,
  readEntity,
} = require('../src/site/stages/build/process-cms-exports/helpers');

const files = readAllNodeNames()
  .map(entityDetails => readEntity(...entityDetails))
  .map(entity => assembleEntityTree(entity));

// eslint-disable-next-line
console.log('Number of files:', files.length);
