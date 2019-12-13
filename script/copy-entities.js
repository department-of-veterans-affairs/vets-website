/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Take a root-level entity
// Look for all entity references
// When one is found, copy the file and recurse on it
const originalTomeSyncDir = path.join(
  __dirname,
  '../../tome-sync-output/content',
);
const testTomeSyncDir = path.join(
  __dirname,
  '../../test-tome-sync-output/content',
);

const propBlacklist = ['type', 'bundle', 'vid', 'uid', 'revision_uid'];

const readEntity = (baseType, uuid, dir = originalTomeSyncDir) =>
  JSON.parse(
    fs
      .readFileSync(path.join(dir, `${baseType}.${uuid}.json`))
      .toString('utf8'),
  );

const copyEntity = (baseType, uuid) => {
  const fileName = `${baseType}.${uuid}.json`;
  fs.copyFileSync(
    path.join(originalTomeSyncDir, fileName),
    path.join(testTomeSyncDir, fileName),
  );
};

const copyChildren = (entity, depth = 0) => {
  // Set up a little pretty formatting
  const spaces = ' '.repeat(depth * 2);
  console.log(spaces, chalk.green(entity.uuid[0].value));

  // Iterate through the non-blacklisted properties
  // When an entity reference is found, copy it over and recurse on it
  Object.keys(entity)
    .filter(k => !propBlacklist.includes(k))
    .forEach(propName => {
      // Properties should always be arrays, but just in case, check
      if (Array.isArray(entity[propName])) {
        entity[propName].forEach((p, index) => {
          if (p.target_type && p.target_uuid) {
            // Found an entity reference!
            console.log(
              spaces,
              'Copying entity found at',
              chalk.blue(`${propName}[${index}]`),
            );
            copyEntity(p.target_type, p.target_uuid);
            copyChildren(readEntity(p.target_type, p.target_uuid), depth + 1);
          }
        });
      } else {
        console.log(spaces, chalk.yellow(`Prop ${propName} is not an array.`));
      }
    });
};

// Do this when called from the CLI
// Get the entity filename from the args
const fileName = process.argv[2];

const [baseType, uuid] = fileName.split('.').slice(0, 2);

copyEntity(baseType, uuid);
copyChildren(readEntity(baseType, uuid));
