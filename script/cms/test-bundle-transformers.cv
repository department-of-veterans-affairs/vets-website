/* eslint-disable no-console */

const path = require('path');
const fs = require('fs');
const assert = require('assert');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const { map } = require('lodash');

const contentDir = path.resolve(
  __dirname,
  '../../.cache/localhost/cms-export-content',
);

const assembleEntityTree = require('../../src/site/stages/build/process-cms-exports')(
  contentDir,
);
const {
  readEntity,
} = require('../../src/site/stages/build/process-cms-exports/helpers');

const optionDefinitions = [
  {
    name: 'entity',
    alias: 'e',
    type: String,
    multiple: true,
    description: 'Specify specific entities (usually nodes) to transform.',
  },
  {
    name: 'count',
    alias: 'c',
    type: Number,
    description:
      'Load only this many nodes. Only used when no specific entities are specified with --node.',
  },
  {
    name: 'print',
    type: Number,
    description:
      'Only print the node at this index. Used for debugging. Not needed when specific entiteis are specified with --node.',
  },
  {
    name: 'help',
    type: Boolean,
    description: 'Show this help.',
  },
  {
    name: 'bundle',
    type: String,
    description:
      'Transform all entities of the bundle type specified. For example, "page" or "block_content-alert"',
  },
];

const {
  count,
  entity: entityNames,
  print: printIndex,
  bundle,
  help,
} = commandLineArgs(optionDefinitions);

if (help) {
  console.log(
    commandLineUsage([
      {
        header: 'Assemble entity tree',
        content:
          'Test the CMS export transformers. When no arguments are present, the script reads in all node.*.json files and assembles entity trees for each node present in the CMS export.',
      },
      {
        header: 'Options',
        optionList: optionDefinitions,
      },
    ]),
  );
  process.exit(0);
}

if (entityNames) {
  const result = entityNames.map(entityName => {
    const nodeNamePieces = entityName.split('.').slice(0, 2);
    assert(
      nodeNamePieces.length === 2,
      '--entity (or -e) needs to be the filename of an entity. E.g. node.<uuid>.json',
    );

    return assembleEntityTree(readEntity(contentDir, ...nodeNamePieces));
  });
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(result.length === 1 ? result[0] : result, null, 2),
  );
} else {
  // Make sure the printIndex is valid if passed
  if (printIndex) {
    if (count)
      assert(
        printIndex < count,
        `--print index (${printIndex}) must be less than node count (${count}) to point to a valid node.`,
      );
    assert(printIndex >= 0, `Print index (${printIndex}) must be >= 0`);
  }

  let fileNames = fs
    .readdirSync(contentDir)
    .filter(fn => fn !== 'meta')
    .map(name => name.split('.').slice(0, 2));

  if (!bundle) {
    fileNames = fileNames.filter(([baseType]) => baseType === 'node');
  }

  let entities = map(
    fileNames.slice(0, count || fileNames.length),
    entityDetails => readEntity(contentDir, ...entityDetails),
  );

  if (bundle) {
    // Find only the entities that match the bundle type
    entities = entities.filter(
      bundle.includes('-')
        ? e => e.contentModelType === bundle
        : e => e.contentModelType.split('-')[1] === bundle,
    );
  }

  const modifiedEntities = map(entities, entity => assembleEntityTree(entity));

  // eslint-disable-next-line no-console
  console.log('Number of entities transformed:', modifiedEntities.length);
  if (printIndex !== undefined) {
    // eslint-disable-next-line no-console
    console.log(
      `Entity at index ${printIndex}:`,
      JSON.stringify(modifiedEntities[printIndex], null, 2),
    );
  }
}
