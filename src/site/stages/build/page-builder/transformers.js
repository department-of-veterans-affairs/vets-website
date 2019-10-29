const _ = require('lodash');

/**
 * A very specific helper function that expects to receive an
 * array with one item which is an object with a single `value` property
 *
 */
function arrayCollapse(arr) {
  return arr.reduce((value, item) => {
    // eslint-disable-next-line no-param-reassign
    value = item.value;
    return value;
  }, null);
}

function pageTransform(entity) {
  const transformed = entity;
  const {
    title,
    changed,
    fieldIntroText,
    fieldPageLastBuilt,
    fieldAlert,
    fieldDescription,
    moderationState: [{ value: published }],
  } = entity;
  // collapse title
  // Question: Can we always assume that title is an array of one item, with that item being an object with a `value` key?
  transformed.title = arrayCollapse(title);
  transformed.entityBundle = 'page';

  transformed.fieldIntroText = arrayCollapse(fieldIntroText);
  transformed.changed = new Date(arrayCollapse(changed)).getTime() / 1000;
  transformed.fieldPageLastBuilt = new Date(
    arrayCollapse(fieldPageLastBuilt),
  ).toUTCString();

  transformed.entityPublished = published === 'published';
  delete transformed.moderationState;

  if (_.isEmpty(fieldDescription)) {
    transformed.fieldDescription = null;
  }

  if (_.isEmpty(_.flatten(fieldAlert))) {
    transformed.fieldAlert = { entity: null };
  }

  return entity;
}

const transformers = {
  page: pageTransform,
};

const missingTransformers = new Set();

/**
 * Returns the proper function for transforming a specific entity type.
 * If no transformer exists for the entity type, it returns a function
 * that will return the entity unmodified, and it will log a warning.
 *
 * @param {String} entityType - The type of the entity
 * @return {Function} - A function that accepts an entity and transforms it
 */
function getEntityTransformer(entityType) {
  let entityTransformer = entity => entity;

  if (entityType in transformers) {
    entityTransformer = transformers[entityType];
  } else if (!missingTransformers.has(entityType)) {
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
 * @param {String} contentModelType - The type of content model.
 * @param {Object} entity - The contents of the entity itself before
 *                          reference expansion and property
 *                          transformation.
 *
 * @return {Object} - The entity with modified properties based on
 *                    the specific content model type.
 */
function transformEntity(entityType, entity) {
  // TODO: Perform transformations based on the content model type

  const entityTransformer = getEntityTransformer(entityType);

  // Convert all snake_case keys to camelCase
  const transformed = _.mapKeys(entity, (v, k) => _.camelCase(k));

  return entityTransformer(transformed);
}

module.exports = {
  transformEntity,
};
