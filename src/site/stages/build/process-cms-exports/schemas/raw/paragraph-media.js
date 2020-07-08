/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    parent_field_name: { $ref: 'GenericNestedString' },
    field_allow_clicks_on_this_image: { $ref: 'GenericNestedBoolean' },
    // At the time of writing, field_markup in all paragraph-media entities
    // was empty, but the OpenAPI says it'll be a string
    field_markup: { $ref: 'GenericNestedString' },
    field_media: { $ref: 'EntityReferenceArray' },
  },
  required: [
    'parent_field_name',
    'field_allow_clicks_on_this_image',
    'field_markup',
    'field_media',
  ],
};
