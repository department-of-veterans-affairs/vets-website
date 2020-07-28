const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'media',
    fieldAllowClicksOnThisImage:
      // OpenAPI spec says this defaults to false
      getDrupalValue(entity.fieldAllowClicksOnThisImage) || false,
    fieldMedia: entity.fieldMedia[0] || null,
  },
});

module.exports = {
  filter: ['field_allow_clicks_on_this_image', 'field_media'],
  transform,
};
