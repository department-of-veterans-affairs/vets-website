const {
  getModifiedEntity,
  toId,
  readEntity,
  readAllNodeNames,
} = require('./page-builder/helpers');

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

const files = readAllNodeNames().map(([type, uuid]) =>
  assembleEntityTree(type, uuid),
);

// eslint-disable-next-line no-console
console.log(files.length);

// console.log(JSON.stringify(files[0], null, 2));
