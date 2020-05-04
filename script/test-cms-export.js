const path = require('path');
const assert = require('assert');
const commandLineArgs = require('command-line-args');
const { map } = require('lodash');

const contentDir = path.resolve(__dirname, '../../cms-export/content');

const assembleEntityTree = require('../src/site/stages/build/process-cms-exports')(
  contentDir,
);
const {
  readAllNodeNames,
  readEntity,
} = require('../src/site/stages/build/process-cms-exports/helpers');

const optionDefinitions = [
  { name: 'count', alias: 'c', type: Number },
  { name: 'node', alias: 'n', type: String },
  { name: 'print', alias: 'p', type: Number },
];

const { count, node: nodeName, print: printIndex } = commandLineArgs(
  optionDefinitions,
);

if (nodeName) {
  const nodeNamePieces = nodeName.split('.').slice(0, 2);
  assert(
    nodeNamePieces.length === 2,
    'Node needs to be the filename of an entity. E.g. node.<uuid>.json',
  );

  const node = assembleEntityTree(readEntity(contentDir, ...nodeNamePieces));
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(node, null, 2));
} else {
  // Make sure the printIndex is valid if passed
  if (printIndex) {
    if (count)
      assert(
        printIndex < count,
        `Print index (${printIndex}) must be less than node count (${count}) to point to a valid node.`,
      );
    assert(printIndex >= 0, `Print index (${printIndex}) must be >= 0`);
  }

  const fileNames = readAllNodeNames(contentDir);
  const entities = map(fileNames, entityDetails =>
    readEntity(contentDir, ...entityDetails),
  );

  const modifiedEntities = map(
    entities.slice(0, count || entities.length),
    entity => assembleEntityTree(entity),
  );

  // eslint-disable-next-line no-console
  console.log('Number of files:', modifiedEntities.length);
  if (printIndex !== undefined) {
    // eslint-disable-next-line no-console
    console.log(
      `Node ${printIndex}:`,
      JSON.stringify(modifiedEntities[printIndex], null, 2),
    );
  }
}
