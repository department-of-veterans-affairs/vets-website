// Relative imports.
const {
  getDrupalValue,
  utcToEpochTime,
  getWysiwygString,
  createLink,
  createMetaTagArray,
  isPublished,
  getImageCrop,
} = require('./helpers');

const transform = entity => {
  return {
    changed: utcToEpochTime(getDrupalValue(entity.changed)),
    entityBundle: 'basic_landing_page',
    entityMetatags: createMetaTagArray(entity.metatag.value),
    entityPublished: isPublished(getDrupalValue(entity.status)),
    entityType: 'node',
    fieldContentBlock: entity.fieldContentBlock,
    fieldDescription: entity.fieldDescription,
    fieldIntroTextLimitedHtml: entity.fieldIntroTextLimitedHtml[0],
    fieldMetaTitle: entity.fieldMetaTitle,
    fieldProduct: entity.fieldProduct,
    fieldTableOfContentsBoolean: entity.fieldTableOfContentsBoolean,
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
    'status',
    'title',
  ],
  transform,
};
