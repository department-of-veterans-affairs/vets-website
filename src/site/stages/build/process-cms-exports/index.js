const chalk = require('chalk');
const get = require('lodash/get');

const { getFilteredEntity } = require('./filters');
const { transformEntity } = require('./transform');
const {
  toId,
  readEntity,
  getContentModelType,
  entityIsPublished,
} = require('./helpers');
const { transformFields } = require('./transform-fields');

const {
  validateRawEntity,
  validateTransformedEntity,
} = require('./schema-validation');

/**
 * @param {Object} entity - The entity we're validating
 * @throws {Error} If the entity is invalid
 */
const validateInput = entity => {
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
};

/**
 * @param {Object} entity - The original entity; used for error logging
 * @param {Object} transformedEntity - The entity after transformation
 * @throws {Error} If the entity is invalid
 */
const validateOutput = (entity, transformedEntity) => {
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
};

const entityAssemblerFactory = contentDir => {
  // TODO: Pass contentDir down to where we finally read the entities from disk.

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
  return entity => {
    // eslint-disable-next-line no-console
    console.log(
      chalk.blue(
        `Using the prototype field transformer on ${getContentModelType(
          entity,
        )} (${toId(entity)})`,
      ),
    );

    validateInput(entity);
    const transformed = transformFields(entity);
    validateOutput(entity, transformed);

    // eslint-disable-next-line no-console
    console.log(
      chalk.green(
        `Transformed ${transformed.contentModelType} (${toId(entity)}`,
      ),
      // JSON.stringify(transformed, null, 2),
    );
    return transformed;
  };
};

module.exports = entityAssemblerFactory;
