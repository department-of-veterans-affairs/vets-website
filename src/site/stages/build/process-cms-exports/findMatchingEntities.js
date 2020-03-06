const assert = require('assert');
const fs = require('fs');
const assembleEntityTreeFactory = require('./index');
const { readEntity } = require('./helpers');

/*
 * NOTE: This would ideally be in transformers/helpers.js but ./index.js depends
 * on that file already, so it would create a circular dependency.
 */

/**
 * Search for all entities matching the parameters and return the transformed
 * entities.
 *
 * @param {String} baseType - The base type of the entity
 * @param {String} contentDir - The path to the directory to read the files from
 * @param {String} subType - [Optional] The subType of the entity
 * @param {Function} filter - [Optional] A function which recieves the object
 *                              read from the JSON file and returns true if we
 *                              should keep the entity or false if we should not
 *
 * TODO: Memoize this function to improve speed if the build is slow because
 * of this CMS content transformation process.
 *
 * @return {Array<Object>} - The transformed entities whose raw form matches
 *                           the parameters
 */
function findMatchingEntities(baseType, contentDir, { subType, filter } = {}) {
  // Sanity checks
  assert(
    typeof baseType === 'string',
    `baseType needs to be a string. Found ${typeof baseType} (${baseType})`,
  );
  assert(
    fs.lstatSync(contentDir).isDirectory(),
    `${contentDir} is not a directory.`,
  );
  if (subType)
    assert(
      typeof subType === 'string',
      `subType needs to be a string. Found ${typeof subType} (${subType})`,
    );
  if (filter)
    assert(
      typeof filter === 'function',
      `filter needs to be a string. Found ${typeof filter} (${filter})`,
    );

  const assembleEntityTree = assembleEntityTreeFactory(contentDir);

  // Look through contentDir for all `${baseType}.*.json` files
  return (
    fs
      .readdirSync(contentDir)
      .filter(name => name.startsWith(`${baseType}.`))
      .map(name => {
        const uuid = name.split('.')[1];
        return readEntity(contentDir, baseType, uuid);
      })
      .filter(
        // Filter them by `subType` if available
        // NOTE: Not all content models keep their subType in `.type[0]`
        // If we have to search for those content models, we'll need to update this
        entity => (subType ? entity.type[0].target_id === subType : true),
      )
      // Filter them by `filter` if available
      .filter(entity => (filter ? filter(entity) : true))
      .map(entity => assembleEntityTree(entity))
  );
}

module.exports = findMatchingEntities;
