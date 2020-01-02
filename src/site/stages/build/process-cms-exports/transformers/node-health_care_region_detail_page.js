const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'health_care_region_detail_page',
    title: getDrupalValue(entity.title),
    changed: getDrupalValue(entity.changed),
    path: getDrupalValue(entity.path),
    fieldAlert: getDrupalValue(entity.fieldAlert),
    fieldContentBlock: getDrupalValue(entity.fieldContentBlock),
    fieldFeaturedContent: getDrupalValue(entity.fieldFeaturedContent),
    fieldIntroText: getDrupalValue(entity.fieldIntroText),
    fieldOffice: getDrupalValue(entity.fieldOffice),
    fieldRelatedLinks: getDrupalValue(entity.fieldRelatedLinks),
    fieldTableOfContentsBoolean: getDrupalValue(
      entity.fieldTableOfContentsBoolean,
    ),
  },
});
module.exports = {
  filter: [
    'title',
    'changed',
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
