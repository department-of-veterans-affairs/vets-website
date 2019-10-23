/**
 * When reading through entity properties, ignore these.
 */
const blackList = new Set([
  'type',
  'revision_uid',
  'revision_user',
  'user_id',
  'items',
  'owner_id',
  'parent',
  'role_id',
  'roles',
  'uid',
  'vid',
  'access_scheme',
  'bundle',
  // Temporarily ignore the following properties because they were
  // causing circular references. Once we get reader functions based
  // on individual node / entity types, we can remove these from here.
  // See the jsdoc on getEntityProperties for more information.
  'field_facility_location',
  'field_regional_health_service',
  'field_region_page',
  'field_office',
]);

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
function getContentModelType(entityType, entity) {
  return entity.type ? entity.type[0].target_id : entityType;
}

/**
 * Takes the entity type and entity contents before any data
 * transformation and returns a new entity with only the desired
 * properties based on the content model type.
 *
 * @param {String} contentModelType - The type of content model.
 * @param {Object} entity - The contents of the entity itself before
 *                          reference expansion and property
 *                          transformation.
 *
 * @return {Object} - The entity with only the desired properties
 *                    for the specific content model type.
 */
function getFilteredEntity(contentModelType, entity) {
  // TODO: Filter properties based on content model type
  return Object.keys(entity).reduce((newEntity, key) => {
    // eslint-disable-next-line no-param-reassign
    if (!blackList.has(key)) newEntity[key] = entity[key];
    return newEntity;
  }, {});
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
    const contentModelType = getContentModelType(entityType, entity);
    return transformEntity(
      contentModelType,
      getFilteredEntity(contentModelType, entity),
    );
  },
};
