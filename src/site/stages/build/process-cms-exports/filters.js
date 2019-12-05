const path = require('path');
const { getContentModelType, getAllImportsFrom } = require('./helpers');

// Dynamically read in all the filters
// They must be named after the content model type (E.g. node-page.js)
const filtersDir = path.join(__dirname, 'transformers');
const filters = getAllImportsFrom(filtersDir, 'filter');

/**
 * When reading through entity properties, ignore these.
 */

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
  if (!entityTypeFilter.length) return entity;

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
