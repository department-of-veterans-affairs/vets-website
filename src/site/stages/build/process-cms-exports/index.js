const chalk = require('chalk');
const get = require('lodash/get');

const { getFilteredEntity } = require('./filters');
const { transformEntity } = require('./transform');
const { typeProperties, toId, readEntity } = require('./helpers');

const {
  validateRawEntity,
  validateTransformedEntity,
} = require('./schema-validation');

const entityAssemblerFactory = contentDir => {
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
      throw new Error(`${toId(entity)} is invalid before transformation`);
    }

    // Pre-transformation JSON schema validation
    const rawErrors = validateRawEntity(entity);
    if (rawErrors.length) {
      /* eslint-disable no-console */
      console.warn(
        chalk.yellow(`${toId(entity)} is invalid before transformation:`),
      );
      console.warn(`${rawErrors.map(e => JSON.stringify(e, null, 2))}`);
      console.warn(`-------------------`);
      /* eslint-enable no-console */

      // Abort! (We may want to change this later)
      process.exit(1);
    }

    const filteredEntity = getFilteredEntity(entity);

    // Recursively expand entity references
    for (const [key, prop] of Object.entries(filteredEntity)) {
      // eslint-disable-next-line no-continue
      if (typeProperties.includes(key)) continue;

      // Properties with target_uuids are always arrays from tome-sync
      if (Array.isArray(prop)) {
        prop.forEach((item, index) => {
          const { target_uuid: targetUuid, target_type: targetType } = item;

          // We found a reference! Override it with the expanded entity.
          if (targetUuid && targetType) {
            filteredEntity[key][index] = assembleEntityTree(
              readEntity(contentDir, targetType, targetUuid),
              parents.concat([toId(entity)]),
            );
          }
        });
      }
    }

    // Post-transformation JSON schema validation
    const transformedEntity = transformEntity(filteredEntity);
    const transformedErrors = validateTransformedEntity(transformedEntity);
    if (transformedErrors.length) {
      /* eslint-disable no-console */
      console.warn(
        chalk.yellow(`${toId(entity)} is invalid after transformation:`),
      );
      console.warn(`${transformedErrors.map(e => JSON.stringify(e, null, 2))}`);
      transformedErrors.forEach(e => {
        console.warn(
          `Data found at ${e.dataPath}:`,
          JSON.stringify(get(transformedEntity, e.dataPath.slice(1))),
        );
      });
      console.warn(`-------------------`);
      /* eslint-enable no-console */

      // Abort! (We may want to change this later)
      throw new Error(`${toId(entity)} is invalid after transformation`);
    }

    return transformedEntity;
  };

  return assembleEntityTree;
};

module.exports = entityAssemblerFactory;
