// Relative imports.
const {
  getDrupalValue,
  utcToEpochTime,
  createMetaTagArray,
  isPublished,
} = require('./helpers');

const transform = entity => {
  return {
    changed: utcToEpochTime(getDrupalValue(entity.changed)),
    entityBundle: 'basic_landing_page',
    entityMetatags: createMetaTagArray(entity.metatag.value),
    entityPublished: isPublished(getDrupalValue(entity.status)),
    entityType: 'node',
    fieldContentBlock: entity.fieldContentBlock[0],
    fieldDescription: entity.fieldDescription?.[0]?.value || null,
    fieldIntroTextLimitedHtml: entity.fieldIntroTextLimitedHtml[0],
    fieldMetaTitle: entity.fieldMetaTitle?.[0]?.value || null,
    fieldProduct: entity.fieldProduct?.[0] || null,
    fieldTableOfContentsBoolean:
      entity.fieldTableOfContentsBoolean?.[0]?.value || false,
    title: getDrupalValue(entity.title),
  };
};

module.exports = {
  filter: [
    'changed',
    'created',
    'field_content_block',
    'field_description',
    'field_intro_text_limited_html',
    'field_meta_title',
    'field_product',
    'field_table_of_contents_boolean',
    'metatag',
    'title',
  ],
  transform,
};
