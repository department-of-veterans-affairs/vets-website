/* eslint-disable no-console */

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
 * An ancestor for an entity.
 * @typedef {Object} Ancestor
 * @property {string} id - The toId()'d string for the ancestor
 * @property {Object} entity - The actual ancestor entity
 */

/**
 * @param {Object} entity - The current entity
 * @param {Ancestor[]} ancestors - A list of all ancestors
 * @return {Object|bool} If the current entity is a circular reference, return the original
 * If the current entity is not a circular reference, return false
 */
const findCircularReference = (entity, ancestors) => {
  const ancestorIds = ancestors.map(a => a.id);
  const a = ancestors.find(r => r.id === toId(entity));
  if (a) {
    // This logging is to help debug if AJV fails on an unexpected circular
    // reference
    console.log(`I'm my own grandpa! (${toId(entity)})`);
    console.log(`  Parents:\n    ${ancestorIds.join('\n    ')}`);

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

/**
 * @param {Object} entity - The entity we're validating
 * @throws {Error} If the entity is invalid
 */
const validateInput = entity => {
  // Pre-transformation JSON schema validation
  const rawErrors = validateRawEntity(entity);
  if (rawErrors.length) {
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

    // Abort! (We may want to change this later)
    throw new Error(`${toId(entity)} is invalid before transformation`);
  }
};

/**
 * @param {Object} transformedEntity - The entity after transformation
 * @throws {Error} If the entity is invalid
 */
const validateOutput = (entity, transformedEntity) => {
  const transformedErrors = validateTransformedEntity(transformedEntity);
  if (transformedErrors.length) {
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

    // Abort! (We may want to change this later)
    throw new Error(`${toId(entity)} is invalid after transformation`);
  }
};

/**
 * Add common properties to the transformed entity. Mutates `transformedEntity`
 * to save memory.
 * @param {Object} transformedEntity - The entity after transformation
 * @param {Object} originalEntity - The entity before transformation
 * @returns {void}
 */
const addCommonProperties = (transformedEntity, originalEntity) => {
  /* eslint-disable no-param-reassign */
  transformedEntity.contentModelType =
    transformedEntity.contentModelType || getContentModelType(originalEntity);
  const [
    entityType,
    entityBundle,
  ] = transformedEntity.contentModelType.includes('-')
    ? transformedEntity.contentModelType.split('-')
    : [transformedEntity.contentModelType, transformedEntity.contentModelType];
  transformedEntity.entityType = entityType;
  transformedEntity.entityBundle = entityBundle;
  transformedEntity.entityUrl = originalEntity.entityUrl;
  transformedEntity.entityId = (originalEntity.nid ||
    originalEntity.tid ||
    originalEntity.id ||
    originalEntity.mid ||
    originalEntity.fid)[0].value.toString();
  /* eslint-enable no-param-reassign */
};

const entityAssemblerFactory = contentDir => {
  /**
   * @param {Object} entity - The entity with entity references
   * @param {Ancestor[]} ancestors - A list of all ancestors
   * @param {function} assembleTree - The assembleEntityTree closure; defined as
   *                                  a parameter here because eslint didn't
   *                                  like using it before it was defined
   * @param {bool} transformUnpublished - Whether or not to transform
   *                                  unpublished entities.
   * @return {Object} The entity with the references filled in
   */
  const expandEntityReferences = (
    entity,
    ancestors,
    assembleTree,
    transformUnpublished,
  ) => {
    const filteredEntity = getFilteredEntity(entity);

    // Recursively expand entity references
    for (const [key, prop] of Object.entries(filteredEntity)) {
      const isEntityArray =
        Array.isArray(prop) && prop.some(e => e.target_uuid && e.target_type);
      if (isEntityArray) {
        prop.forEach((item, index) => {
          const { target_uuid: targetUuid, target_type: targetType } = item;

          // We need to double-check every item in the "entity reference array"
          // since sometimes items in the array are empty arrays themselves.
          if (targetUuid && targetType) {
            filteredEntity[key][index] = assembleTree(
              readEntity(contentDir, targetType, targetUuid),
              transformUnpublished,
              ancestors.concat([{ id: toId(entity), entity }]),
              key,
            );
          }
        });

        // Filter out all unpublished entities from the array
        filteredEntity[key] = filteredEntity[key].filter(e => e);
      }
    }

    return filteredEntity;
  };

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
   * @param {bool} transformUnpublished - Whether or not to transform
   *                          unpublished entities.
   *
   * @return {Object|null} - The entity with all the references filled in with
   *                         the body of the referenced entities. If the entity
   *                         is unpublished, return null.
   */
  const assembleEntityTree = (
    entity,
    transformUnpublished,
    ancestors = [],
    parentFieldName = '',
  ) => {
    // If the entity is unpublished
    if (!entity.status[0].value && !transformUnpublished) {
      return null;
    }

    // Handle circular references
    const a = findCircularReference(entity, ancestors);
    if (a) return a;

    validateInput(entity);

    let expandedEntity;
    try {
      expandedEntity = expandEntityReferences(
        entity,
        ancestors,
        assembleEntityTree,
        transformUnpublished,
      );
    } catch (e) {
      console.log(
        chalk.red(
          `Error encountered while expanding entity references for ${toId(
            entity,
          )}`,
        ),
      );
      throw e;
    }

    let transformedEntity;
    try {
      // Post-transformation JSON schema validation
      transformedEntity = transformEntity(expandedEntity, {
        uuid: entity.uuid[0].value,
        ancestors,
        parentFieldName,
        contentDir,
        assembleEntityTree,
        transformUnpublished,
      });
    } catch (e) {
      console.log(
        chalk.red(`Error encountered while transforming ${toId(entity)}`),
      );
      throw e;
    }

    // Mutates transformedEntity
    addCommonProperties(transformedEntity, entity);

    validateOutput(entity, transformedEntity);

    return transformedEntity;
  };

  return assembleEntityTree;
};

module.exports = entityAssemblerFactory;
