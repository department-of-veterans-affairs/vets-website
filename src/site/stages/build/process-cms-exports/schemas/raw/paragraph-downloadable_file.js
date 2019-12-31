/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_markup: { $ref: 'GenericNestedString' },
    field_media: { $ref: 'EntityReferenceArray' },
    field_title: { $ref: 'GenericNestedString' },
  },
  required: ['field_markup', 'field_media', 'field_title'],
};
