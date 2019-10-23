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
// eslint-disable-next-line no-unused-vars
function getContentModelType(entityType, entity) {
  return entity.type[0].target_id;
}

/**
 * Takes the entity type and entity contents before any data
 * transformation and returns a new entity with only the desired
 * properties based on the content model type.
 *
 * @param {String} entityType - The type of entity; corresponds to
 *                              the name of the file. We may not end
 *                              up using this.
 * @param {Object} entity - The contents of the entity itself before
 *                          reference expansion and property
 *                          transformation.
 *
 * @return {Object} - The entity with only the desired properties
 *                    for the specific content model type.
 */
function getFilteredEntity(entityType, entity) {
  // TODO: Filter properties based on content model type
  return entity;
}

/**
 * Takes the entity type and entity contents and returns a new
 * entity with modified data to fit the content model.
 *
 * @param {String} entityType - The type of entity; corresponds to
 *                              the name of the file. We may not end
 *                              up using this.
 * @param {Object} entity - The contents of the entity itself before
 *                          reference expansion and property
 *                          transformation.
 *
 * @return {Object} - The entity with modified properties based on
 *                    the specific content model type.
 */
function transformEntity(entityType, entity) {
  // TODO: Perform transformations based on the content model type
  return entity;
}

module.exports = {
  /**
   * Takes the type of entity and entity itself, returns the entity
   * after transformations. Note: The entity will only contain a subset
   * of all the original properties based on type and subtype.
   *
   * @param {String} entityType - The type of entity; corresponds to
   *                              the name of the file. We may not end
   *                              up using this.
   * @param {Object} entity - The contents of the entity itself before
   *                          reference expansion.
   *
   * @return {Object} - The new entity.
   */
  getModifiedEntity(entityType, entity) {
    // TODO: Filter unwanted properties
    // TODO: Modify the data (e.g. change property names and casing to
    //       fit the content model expected in the templates)
    return transformEntity(entityType, getFilteredEntity(entityType, entity));
  },
};
