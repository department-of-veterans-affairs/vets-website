const {
  isPublished,
  getDrupalValue,
  utcToEpochTime,
  createMetaTagArray,
} = require('./helpers');

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'health_care_region_detail_page',
  title: getDrupalValue(entity.title),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityPublished: isPublished(getDrupalValue(entity.status)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAlert: getDrupalValue(entity.fieldAlert),
  fieldContentBlock: entity.fieldContentBlock.filter(
    content => content.entityPublished,
  ),
  fieldFeaturedContent: entity.fieldFeaturedContent,
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldOffice: entity.fieldOffice[0]
    ? {
        entity: !ancestors.find(
          r => r.entity.uuid === entity.fieldOffice[0].uuid,
        )
          ? entity.fieldOffice[0]
          : {
              entityLabel: getDrupalValue(entity.fieldOffice[0].title),
              entityType: entity.fieldOffice[0].entityType,
            },
      }
    : null,
  fieldRelatedLinks: entity.fieldRelatedLinks[0] || null,
  fieldTableOfContentsBoolean: getDrupalValue(
    entity.fieldTableOfContentsBoolean,
  ),
});
module.exports = {
  filter: [
    'title',
    'changed',
    'metatag',
    'status',
    'path',
    'field_alert',
    'field_content_block',
    'field_featured_content',
    'field_intro_text',
    'field_office',
    'field_related_links',
    'field_table_of_contents_boolean',
  ],
  transform,
};
