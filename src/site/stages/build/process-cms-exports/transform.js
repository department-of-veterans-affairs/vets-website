const path = require('path');

const { mapKeys, camelCase } = require('lodash');
const { getContentModelType, getAllImportsFrom } = require('./helpers');

// Dynamically read in all the transformers
// They must be named after the content model type (E.g. node-page.js)
const transformersDir = path.join(__dirname, 'transformers');
const transformers = getAllImportsFrom(transformersDir, 'transform');
const missingTransformers = new Set();

/**
 * Returns the proper function for transforming a specific entity type.
 * If no transformer exists for the entity type, it returns a function
 * that will return the entity unmodified, and it will log a warning.
 *
 * @param {String} entityType - The type of the entity
 * @return {Function} - A function that accepts an entity and transforms it
 */
function getEntityTransformer(entityType, verbose = true) {
  let entityTransformer;

  if (entityType in transformers) {
    entityTransformer = transformers[entityType];
  } else if (verbose && !missingTransformers.has(entityType)) {
    missingTransformers.add(entityType);
    // eslint-disable-next-line no-console
    console.warn(`No transformer for target_id ${entityType}`);
  }

  return entityTransformer;
}

/**
 * Takes the entity type and entity contents and returns a new
 * entity with modified data to fit the content model.
 *
 * @param {Object} entity - The contents of the entity itself before
 *                          reference expansion and property
 *                          transformation.
 * @param {Object} rest - Contains the lesser-used arguments for the
 *                        transformers.
 * @property {string} rest.uuid - The UUID of the current entity
 * @property {Array<Object>} rest.ancestors - All the current entity's
 *                        ancestors. ancestors[1] is the child of
 *                        ancestors[0], etc.
 *                        ancestors[ancestors.length - 1] is the
 *                        current entity's direct parent.
 *                        Each item in the array is like:
 *                        { id: toId(entity), entity: entity }
 * @property {string} rest.parentFieldName - The name of the field in the
 *                        entity's parent in which the current entity can be
 *                        found.
 * @property {string} rest.contentDir - The path to the tome-sync content
 *                        directory.
 * @property {function} rest.assembleEntityTree - The function to assemble the
 *                        entity tree. This is usually the caller of
 *                        transformEntity.
 *
 * @return {Object} - The entity with modified properties based on
 *                    the specific content model type.
 */
function transformEntity(entity, rest) {
  const contentModelType = getContentModelType(entity);
  const entityTransformer = getEntityTransformer(contentModelType);

  // Convert all snake_case keys to camelCase
  const transformed = mapKeys(entity, (v, k) => camelCase(k));

  return entityTransformer
    ? { contentModelType, ...entityTransformer(transformed, rest) }
    : transformed;
}

module.exports = {
  transformEntity,
  getEntityTransformer,
};
