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

const ignoredPageProps = [
  'uuid',
  'langcode',
  'revision_timestamp',
  'revision_uuid',
  'revision_log',
  'status',
  'field_plainlanguage_date',
  'promote',
  'created',
  'sticky',
  'default_langcode',
  'revision_translation_affected',
];

function getFilterType(contentModelType) {
  let ignoredProps = [];
  switch (contentModelType) {
    case 'page':
      ignoredProps = ignoredPageProps;
      break;
    default:
      break;
  }
  return new Set(ignoredProps);
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
  const entityTypeFilter = getFilterType(contentModelType);
  const entityFilter = new Set([...blackList, ...entityTypeFilter]);
  return Object.keys(entity).reduce((newEntity, key) => {
    // eslint-disable-next-line no-param-reassign
    if (!entityFilter.has(key)) newEntity[key] = entity[key];
    return newEntity;
  }, {});
}

module.exports = {
  getFilteredEntity,
};
