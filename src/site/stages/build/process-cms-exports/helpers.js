const fs = require('fs');
const path = require('path');

/**
 * This assumes the tome-sync output is sibling to the vets-website
 * directory.
 */
const contentDir = path.join(
  __dirname,
  '../../../../../../tome-sync-output/content/',
);

/**
 * Get the content model type of an entity. This is used for
 * determining how to handle specific entities. For example, in some
 * node entities, we want to ignore certain properties to avoid
 * circular references.
 *
 * @param {String} entityType - The type of entity; corresponds to
 *                              the name of the file. We may not end
 *                              up using this.
 * @param {Object} entity - The contents of the entity itself before
 *                          reference expansion.
 *
 * @return {String} - The content model type
 */
function getContentModelType(entity) {
  return entity.type ? entity.type[0].target_id : entity.baseType;
}

module.exports = {
  getContentModelType,

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
  readEntity(baseType, uuid) {
    const entity = JSON.parse(
      fs
        .readFileSync(path.join(contentDir, `${baseType}.${uuid}.json`))
        .toString('utf8'),
    );
    // Add what we already know about the entity
    entity.baseType = baseType;
    // Overrides the UUID property in the contents of the entity
    entity.uuid = uuid;
    return entity;
  },

  /**
   * Get all the starting nodes
   */
  readAllNodeNames() {
    return fs
      .readdirSync(contentDir)
      .filter(name => name.startsWith('node'))
      .map(name => name.split('.').slice(0, 2));
  },
};
