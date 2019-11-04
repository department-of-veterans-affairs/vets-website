const chalk = require('chalk');

const { getFilteredEntity } = require('./filters');
const { transformEntity } = require('./transform');
const { toId } = require('./helpers');

const validateEntity = require('./schema-validation');

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
  // Avoid circular references
  if (parents.includes(toId(entity))) {
    /* eslint-disable no-console */
    console.log(`I'm my own grandpa! (${toId(entity)})`);
    console.log(`  Parents:\n    ${parents.join('\n    ')}`);
    /* eslint-enable no-console */

    // If we find a circular references, it needs to be addressed;
    // just quit
    process.exit(1);
  }

  const errors = validateEntity(entity);
  if (errors.length) {
    /* eslint-disable no-console */
    console.warn(chalk.yellow(`${toId(entity)} is invalid:`));
    console.warn(`${errors.map(e => JSON.stringify(e, null, 2))}`);
    console.warn(`-------------------`);
    /* eslint-enable no-console */

    // Abort! (We may want to change this later)
    process.exit(1);
  }

  const filteredEntity = getFilteredEntity(entity);

  // Iterate over all whitelisted properties in an entity, look for
  // references to other identities recursively, and replace the
  // reference with the entity contents.
  for (const [key, prop] of Object.entries(filteredEntity)) {
    // Properties with target_uuids are always arrays from tome-sync
    if (Array.isArray(prop)) {
      prop.forEach((item, index) => {
        const { target_uuid: targetUuid, target_type: targetType } = item;

        // We found a reference! Override it with the expanded entity.
        if (targetUuid && targetType) {
          filteredEntity[key][index] = assembleEntityTree(
            targetType,
            targetUuid,
            parents.concat([toId(entity)]),
          );
        }
      });
    }
  }

  return transformEntity(filteredEntity);
};

module.exports = assembleEntityTree;
