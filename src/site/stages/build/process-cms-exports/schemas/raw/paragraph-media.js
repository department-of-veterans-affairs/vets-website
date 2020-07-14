/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_allow_clicks_on_this_image: { $ref: 'GenericNestedBoolean' },
    // At the time of writing, field_markup in all paragraph-media entities was
    // empty, but the OpenAPI says it'll be a string. Commenting this out
    // because it doesn't look like it's used.
    //
    // field_markup: { $ref: 'GenericNestedString' },
    field_media: { $ref: 'EntityReferenceArray' },
  },
  required: [
    'field_allow_clicks_on_this_image',
    // 'field_markup',
    'field_media',
  ],
};
