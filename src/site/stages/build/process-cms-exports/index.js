const chalk = require('chalk');
const get = require('lodash/get');

const { getFilteredEntity } = require('./filters');
const { transformEntity } = require('./transform');
const { toId, readEntity, getContentModelType } = require('./helpers');

const {
  validateRawEntity,
  validateTransformedEntity,
} = require('./schema-validation');

/**
 * @param {Object} entity - The current entity
 * @param {Object[]} ancestors - A list of all ancestors like
 * {
 *   id: '<baseType>.<uuid>',
 *   entity: { ... } // The whole entity
 * }
 * @return {Object} If the current entity is a circular reference, return the original
 * @return {false} If the current entity is not a circular reference, return false
 */
const findCircularReference = (entity, ancestors) => {
  const ancestorIds = ancestors.map(a => a.id);
  const a = ancestors.find(r => r.id === toId(entity));
  if (a) {
    /* eslint-disable no-console */
    // This logging is to help debug if AJV fails on an unexpected circular
    // reference
    console.log(`I'm my own grandpa! (${toId(entity)})`);
    console.log(`  Parents:\n    ${ancestorIds.join('\n    ')}`);
    /* eslint-enable no-console */

    // NOTE: If we find a circular reference, it needs to be addressed in the
    // transformer and accounted for in the transformed schema.
    //
    // If it isn't handled in the transformer, the post-transformation
    // validation will fail because of a circular reference (AJV will throw
    // up).
    //
    // If the modified child isn't accounted for in the transformed schema, it
    // won't be valid (assuming we've omited a normally-required property to
    // avoid the circular reference).
    return a;
  }
  return false;
};

const entityAssemblerFactory = contentDir => {
  /**
   * Takes an entity type and uuid, reads the corresponding file,
   * searches for references to other entities, and replaces the
   * references with the contents of those entities recursively.
   *
   * TODO: Memoize this function if the build is slow because of this CMS
   * content transformation process. If we do memoize this, make sure the
   * memoized function is used in findMatchingEntities as well.
   *
   * @param {Object} entity - The entity object.
   * @param {Array<Object>} ancestors - All the ancestors, each like:
   *                          { id: toId(entity), entity }
   * @param {string} parentFieldName - The name of the property of the
   *                          parent in which the current entity can
   *                          be found.
   *
   * @return {Object} - The entity with all the references filled in
   *                    with the body of the referenced entities.
   */
  const assembleEntityTree = (entity, ancestors = [], parentFieldName = '') => {
    // Handle circular references
    const a = findCircularReference(entity, ancestors);
    if (a) return a;

    // Pre-transformation JSON schema validation
    const rawErrors = validateRawEntity(entity);
    if (rawErrors.length) {
      /* eslint-disable no-console */
      console.warn(
        chalk.yellow(
          `${toId(entity)} (${getContentModelType(
            entity,
          )}) is invalid before transformation:`,
        ),
      );
      console.warn(`${rawErrors.map(e => JSON.stringify(e, null, 2))}`);
      rawErrors.forEach(e => {
        console.warn(
          chalk.yellow(`Data found at ${e.dataPath}:`),
          JSON.stringify(get(entity, e.dataPath.slice(1))),
        );
      });
      console.warn(`-------------------`);
      /* eslint-enable no-console */

      // Abort! (We may want to change this later)
      throw new Error(`${toId(entity)} is invalid before transformation`);
    }

    const filteredEntity = getFilteredEntity(entity);

    // Recursively expand entity references
    for (const [key, prop] of Object.entries(filteredEntity)) {
      // Properties with target_uuids are always arrays from tome-sync
      if (Array.isArray(prop)) {
        prop.forEach((item, index) => {
          const { target_uuid: targetUuid, target_type: targetType } = item;

          // We found a reference! Override it with the expanded entity.
          if (targetUuid && targetType) {
            filteredEntity[key][index] = assembleEntityTree(
              readEntity(contentDir, targetType, targetUuid),
              ancestors.concat([{ id: toId(entity), entity }]),
              key,
            );
          }
        });
      }
    }

    // Post-transformation JSON schema validation
    const transformedEntity = transformEntity(filteredEntity, {
      uuid: entity.uuid[0].value,
      ancestors,
      parentFieldName,
      contentDir,
      assembleEntityTree,
    });
    const transformedErrors = validateTransformedEntity(transformedEntity);
    if (transformedErrors.length) {
      /* eslint-disable no-console */
      console.warn(
        chalk.yellow(
          `${toId(entity)} (${getContentModelType(
            entity,
          )}) is invalid after transformation:`,
        ),
      );
      console.warn(`${transformedErrors.map(e => JSON.stringify(e, null, 2))}`);
      transformedErrors.forEach(e => {
        console.warn(
          chalk.yellow(`Data found at ${e.dataPath}:`),
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
