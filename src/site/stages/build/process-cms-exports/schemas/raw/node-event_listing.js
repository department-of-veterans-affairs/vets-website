/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    changed: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          format: { type: 'string' },
        },
        required: ['value', 'format'],
      },
      maxItems: 1,
    },
    metatag: { $ref: 'RawMetaTags' },
    path: { $ref: 'RawPath' },
    field_intro_text: { $ref: 'GenericNestedString' },
    field_office: {
      type: 'array',
      items: {
        $ref: 'EntityReference',
      },
      maxItems: 1,
    },
  },
  required: [
    'title',
    'changed',
    'metatag',
    'path',
    'field_intro_text',
    'field_office',
  ],
};
