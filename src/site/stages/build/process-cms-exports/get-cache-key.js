const path = require('path');
const assert = require('assert');

const { getContentModelType, getAllImportsFrom } = require('./helpers');

const transformersDir = path.join(__dirname, 'transformers');
const cacheKeyFunctions = getAllImportsFrom(transformersDir, 'getCacheKey');

const defaultCacheKeyFunction = entity => entity.uuid;

/**
 * Returns the proper function for determining the cache key in
 * assembleEntityTree. This is useful for transformers that use more than just
 * the entity to determine the output.
 * @param {String} entityType - The type of the entity
 * @return {Function} - A function that accepts the same parameters as
 *                     `transform`. Returns a string.
 */
function getCacheKeyFunctionFor(entityType) {
  return cacheKeyFunctions[entityType] || defaultCacheKeyFunction;
}

/**
 * Returns the key to use in the transformedEntitiesCache.
 *
 * See the JSDoc for transformEntity for a list of parameters.
 * @returns {String} - The cache key
 */
function getCacheKey(entity, rest) {
  const cacheKeyFunction = getCacheKeyFunctionFor(getContentModelType(entity));
  assert(
    typeof cacheKeyFunction === 'function',
    `Expected getCacheKey for ${getContentModelType(
      entity,
    )} to be a function. Found ${typeof cacheKeyFunction}`,
  );

  return cacheKeyFunction(entity, rest);
}

module.exports = {
  getCacheKey,
};
