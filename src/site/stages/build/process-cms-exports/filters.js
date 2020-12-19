const path = require('path');
const {
  getContentModelType,
  getAllImportsFrom,
  typeProperties,
} = require('./helpers');
const { omit } = require('lodash/fp');

// Dynamically read in all the filters
// They must be named after the content model type (E.g. node-page.js)
const filtersDir = path.join(__dirname, 'transformers');
const filters = getAllImportsFrom(filtersDir, 'filter');

/**
 * A list of properties to ignore.
 *
 * This list comes from the typeProperties, which we never want to
 * expand, and a temporary list of properties we don't want to filter
 * out on a per-content-model basis.
 *
 * Additionally, this is useful for temporarily ignoring entity
 * expansion of certain properties before we've created a filter for
 * that content model.
 */
const ignoreList = typeProperties.concat([
  'roles',
  // All attributes which reference the user
  'owner_id',
  'revision_uid',
  'revision_user',
  'uid',
  'user_id',
]);

const whitelists = {
  global: ['title', 'baseType', 'contentModelType'],
  ...filters,
};

const missingFilters = new Set();

function getFilter(contentModelType) {
  const whitelist = whitelists[contentModelType];
  if (!whitelist && !missingFilters.has(contentModelType)) {
    missingFilters.add(contentModelType);
    // eslint-disable-next-line no-console
    console.warn(`No filter for target_id ${contentModelType}`);
  }
  return whitelist || [];
}

/**
 * Takes the entity type and entity contents before any data
 * transformation and returns a new entity with only the desired
 * properties based on the content model type.
 *
 * @param {Object} entity - The contents of the entity itself before
 *                          reference expansion and property
 *                          transformation.
 *
 * @return {Object} - The entity with only the desired properties
 *                    for the specific content model type.
 */
function getFilteredEntity(entity) {
  const contentModelType = getContentModelType(entity);
  const entityTypeFilter = getFilter(contentModelType);

  // There is no filter; return the raw entity
  if (!entityTypeFilter.length) return omit(ignoreList, entity);

  const entityFilter = new Set([...whitelists.global, ...entityTypeFilter]);
  return Object.keys(entity).reduce((newEntity, key) => {
    // eslint-disable-next-line no-param-reassign
    if (entityFilter.has(key)) newEntity[key] = entity[key];
    return newEntity;
  }, {});
}

module.exports = {
  getFilteredEntity,
  getFilter,
};
