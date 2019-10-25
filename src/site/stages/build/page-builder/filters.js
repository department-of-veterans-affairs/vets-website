/**
 * When reading through entity properties, ignore these.
 */
const blackList = new Set([
  'uuid',
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
  'langcode',
  'status',
  'default_langcode',
  'revision_translation_affected',
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
  'revision_timestamp',
  'revision_log',
  'field_plainlanguage_date',
  'promote',
  'created',
  'sticky',
];

const ignoredPromoProps = [
  'revision_created',
  'revision_log',
  'changed',
  'reusable',
  'moderation_state',
  'field_image',
  'field_instructions',
  'field_owner',
];

const ignoredParagraphProps = ['behavior_settings', 'created'];

/* eslint-disable camelcase */
const ignoreMap = {
  page: ignoredPageProps,
  promo: ignoredPromoProps,
  alert: ignoredParagraphProps,
  collapsible_panel: ignoredParagraphProps,
  collapsible_panel_item: ignoredParagraphProps,
  downloadable_file: ignoredParagraphProps,
  expandable_text: ignoredParagraphProps,
  health_care_local_facility_servi: ignoredParagraphProps,
  link_teaser: ignoredParagraphProps,
  list_of_link_teasers: ignoredParagraphProps,
  media: ignoredParagraphProps,
  number_callout: ignoredParagraphProps,
  process: ignoredParagraphProps,
  q_a: ignoredParagraphProps,
  q_a_section: ignoredParagraphProps,
  react_widget: ignoredParagraphProps,
  spanish_translation_summary: ignoredParagraphProps,
  staff_profile: ignoredParagraphProps,
  table: ignoredParagraphProps,
  wysiwyg: ignoredParagraphProps,
};
/* eslint-enable camelcase */

function getFilterType(contentModelType) {
  return new Set(ignoreMap[contentModelType]);
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
