/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    name: { $ref: 'GenericNestedString' },
    field_description: { $ref: 'GenericNestedString' },
    field_media_external_file: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
          title: { type: 'string' },
        },
      },
    },
    field_media_in_library: { $ref: 'GenericNestedBoolean' },
    field_mime_type: { $ref: 'GenericNestedString' },
    field_owner: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          entity: { $ref: 'input/taxonomy_term-administration' },
        },
      },
    },
  },
  required: [
    'name',
    'field_description',
    'field_media_external_file',
    'field_media_in_library',
    'field_mime_type',
    'field_owner',
  ],
};
