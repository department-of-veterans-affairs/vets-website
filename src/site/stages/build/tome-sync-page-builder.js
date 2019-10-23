const fs = require('fs');
const path = require('path');
const { getModifiedEntity } = require('./page-builder/helpers');

/**
 * This assumes the tome-sync output is sibling to the vets-website
 * directory.
 */
const contentDir = path.join(
  __dirname,
  '../../../../../tome-sync-output/content/',
);

/**
 * Use to consistently reference to an entity.
 *
 * @param {String} type - The type of entity; corresponds to the file
 *                        name.
 * @param {String} uuid - The uuid of the entity; corresponds to the
 *                        file name.
 */
const toId = (type, uuid) => `${type}.${uuid}`;

/**
 * Note: Later, we can keep a counter for how many times we open a
 * particular file to see if we can gain anything from caching the
 * contents.
 * @param {String} entityType - The type of entity; corresponds to the
 *                              name of the file.
 * @param {String} uuid - The UUID of the entity; corresponds to the
 *                        name of the file.
 *
 * @return {Object} - The contents of the file.
 */
const readEntity = (type, uuid) =>
  JSON.parse(
    fs
      .readFileSync(path.join(contentDir, `${type}.${uuid}.json`))
      .toString('utf8'),
  );

/**
 * Takes an entity type and uuid, reads the corresponding file,
 * searches for references to other entities, and replaces the
 * references with the contents of those entities recursively.
 *
 * @param {String} entityType - The type of entity; corresponds to the
 *                              name of the file.
 * @param {String} uuid - The UUID of the entity; corresponds to the
 *                        name of the file.
 * @param {Array<String>} parents - A list of parent entities; used to
 *                                  avoid circular references.
 *
 * @return {Object} - The entity with all the references filled in with
 *                    the body of the referenced entities.
 */
const assembleEntityTree = (entityType, uuid, parents = []) => {
  // Avoid circular references
  if (parents.includes(toId(entityType, uuid))) {
    /* eslint-disable no-console */
    console.log(`I'm my own grandpa! (${toId(entityType, uuid)})`);
    console.log(`  Parents:\n    ${parents.join('\n    ')}`);
    /* eslint-enable no-console */

    // If we find a circular references, it needs to be addressed;
    // just quit
    process.exit(1);
  }

  const entity = getModifiedEntity(entityType, readEntity(entityType, uuid));

  // Iterate over all non-blacklisted properties in an entity, look
  // for references to other identities recursively, and replace the
  // reference with the entity contents.
  for (const [key, prop] of Object.entries(entity)) {
    // Properties with target_uuids are always arrays from tome-sync
    if (Array.isArray(prop)) {
      prop.forEach((item, index) => {
        const { target_uuid: targetUuid, target_type: targetType } = item;

        // We found a reference! Override it with the expanded entity.
        if (targetUuid && targetType) {
          entity[key][index] = assembleEntityTree(
            targetType,
            targetUuid,
            parents.concat([toId(entityType, uuid)]),
          );
        }
      });
    }
  }

  return entity;
};

/**
 * Get all the starting nodes
 */
const readAllNodeNames = () =>
  fs
    .readdirSync(contentDir)
    .filter(name => name.startsWith('node'))
    .map(name => name.split('.').slice(0, 2));

const files = readAllNodeNames().map(([type, uuid]) =>
  assembleEntityTree(type, uuid),
);

// eslint-disable-next-line no-console
console.log(files.length);

// console.log(JSON.stringify(files[0], null, 2));
