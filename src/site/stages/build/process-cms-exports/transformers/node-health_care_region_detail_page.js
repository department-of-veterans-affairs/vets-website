const {
  getDrupalValue,
  utcToEpochTime,
  createMetaTagArray,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'health_care_region_detail_page',
  title: getDrupalValue(entity.title),

  changed: utcToEpochTime(getDrupalValue(entity.changed)),

  entityPublished: getDrupalValue(entity.moderationState) === 'published',
  entityMetatags: createMetaTagArray(entity.metatag.value),
  entityUrl: {
    path: entity.path[0].alias,
  },
  fieldAlert: getDrupalValue(entity.fieldAlert),
  fieldContentBlock: entity.fieldContentBlock,
  fieldFeaturedContent: entity.fieldFeaturedContent,
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldOffice: {
    entity: {
      entityLabel: entity.fieldOffice[0].entity.entityLabel,
      fieldNicknameForThisFacility:
        entity.fieldOffice[0].entity.fieldNicknameForThisFacility,
      title: entity.fieldOffice[0].entity.title,
    },
  },
  fieldRelatedLinks:
    entity.fieldRelatedLinks.length > 0 ? entity.fieldRelatedLinks[0] : null,
  fieldTableOfContentsBoolean: getDrupalValue(
    entity.fieldTableOfContentsBoolean,
  ),
});
module.exports = {
  filter: [
    'title',
    'changed',
    'metatag',
    'moderation_state',
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
