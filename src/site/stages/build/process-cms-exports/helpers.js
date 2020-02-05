/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const get = require('lodash/get');

/**
 * This assumes the tome-sync output is sibling to the vets-website
 * directory.
 */
const contentDir = path.join(
  __dirname,
  '../../../../../../tome-sync-output/content/',
);

/**
 * The sub-type can be found in a few different properties, depending
 * on the entity
 */
const typeProperties = ['type', 'bundle', 'vid'];

/**
 * Get the content model type of an entity. This is used for
 * determining how to handle specific entities. For example, in some
 * node entities, we want to ignore certain properties to avoid
 * circular references.
 *
 * @param {Object} entity - The contents of the entity itself
 *
 * @return {String} - The content model type like 'node-page'
 */
function getContentModelType(entity) {
  if (entity.contentModelType) return entity.contentModelType;

  const subType = typeProperties.reduce(
    (foundType, tp) => foundType || get(entity, `${tp}[0].target_id`),
    null,
  );
  return [entity.baseType, subType].filter(x => x).join('-');
}

module.exports = {
  contentDir,
  typeProperties,
  getContentModelType,

  /**
   * Dynamically read in exported properties
   * and put them into an object indexed by filename
   *
   * @param {String} dir - The directory to import all files from
   * @param {String} prop - The name of the exported property to put into the dict
   * @return {Object} - The dict of filenam -> exported prop mappings
   */
  getAllImportsFrom(dir, prop) {
    return fs
      .readdirSync(dir)
      .filter(name => name.endsWith('.js'))
      .reduce((t, fileName) => {
        const contentModelType = path.parse(fileName).name;
        // eslint-disable-next-line no-param-reassign
        t[contentModelType] = require(path.join(dir, fileName))[prop];
        return t;
      }, {});
  },

  /**
   * Use to consistently reference to an entity.
   *
   * @param {Object} entity - The contents of the entity itself before
   *                          reference expansion.
   */
  toId(entity) {
    return `${entity.baseType}.${entity.uuid}`;
  },

  /**
   * Note: Later, we can keep a counter for how many times we open a
   * particular file to see if we can gain anything from caching the
   * contents.
   * @param {String} baseType - The type of entity; corresponds to the
   *                              name of the file.
   * @param {String} uuid - The UUID of the entity; corresponds to the
   *                        name of the file.
   *
   * @return {Object} - The contents of the file.
   */
  readEntity(dir, baseType, uuid) {
    // Used only in script/remove-unnecessary-raw-entity-files.sh to get the
    // list of all entities the assemble-entity-tree.unit.spec.js tests access.
    if (process.env.LOG_USED_ENTITIES) {
      // eslint-disable-next-line no-console
      console.log(`${baseType}.${uuid}.json`);
    }

    const entity = JSON.parse(
      fs
        .readFileSync(path.join(dir, `${baseType}.${uuid}.json`))
        .toString('utf8'),
    );
    // Add what we already know about the entity
    entity.baseType = baseType;
    // Overrides the UUID property in the contents of the entity
    entity.uuid = uuid;
    entity.contentModelType = getContentModelType(entity);
    return entity;
  },

  /**
   * Get all the starting nodes
   */
  readAllNodeNames(dirName = contentDir) {
    return fs
      .readdirSync(dirName)
      .filter(name => name.startsWith('node'))
      .map(name => name.split('.').slice(0, 2));
  },
};
