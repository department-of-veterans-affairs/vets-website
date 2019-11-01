// Dependencies
const { get } = require('lodash');
// Relative
const { getModifiedEntity, toId } = require('./helpers');

/**
 * Takes an entity type and uuid, reads the corresponding file,
 * searches for references to other entities, and replaces the
 * references with the contents of those entities recursively.
 *
 * @param {Object} entity - The entity object.
 *
 * @return {Object} - The entity with all the references filled in with
 *                    the body of the referenced entities.
 */
const assembleEntityTree = (entity, parents = []) => {
  // Derive entity properties.
  const targetID = get(entity, 'type[0].target_id');
  const uuid = get(entity, 'uuid[0].value');

  // Avoid circular references
  if (parents.includes(toId(targetID, uuid))) {
    /* eslint-disable no-console */
    console.log(`I'm my own grandpa! (${toId(targetID, uuid)})`);
    console.log(`  Parents:\n    ${parents.join('\n    ')}`);
    /* eslint-enable no-console */

    // If we find a circular references, it needs to be addressed;
    // just quit
    process.exit(1);
  }

  const modifiedEntity = getModifiedEntity(targetID, entity);

  // Iterate over all non-blacklisted properties in an entity, look
  // for references to other identities recursively, and replace the
  // reference with the entity contents.
  for (const [key, prop] of Object.entries(modifiedEntity)) {
    // Properties with target_uuids are always arrays from tome-sync
    if (Array.isArray(prop)) {
      prop.forEach((item, index) => {
        const { target_uuid: targetUuid, target_type: targetType } = item;

        // We found a reference! Override it with the expanded entity.
        if (targetUuid && targetType) {
          modifiedEntity[key][index] = assembleEntityTree(
            targetType,
            targetUuid,
            parents.concat([toId(targetID, uuid)]),
          );
        }
      });
    }
  }

  return modifiedEntity;
};

module.exports = assembleEntityTree;
