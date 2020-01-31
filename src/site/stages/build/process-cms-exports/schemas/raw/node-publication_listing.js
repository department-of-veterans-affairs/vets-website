/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    changed: { $ref: 'GenericNestedString' },
    moderation_state: { $ref: 'GenericNestedString' },
    metatag: { $ref: 'RawMetaTags' },
    path: { $ref: 'RawPath' },
    field_intro_text: { $ref: 'GenericNestedString' },
    field_office: {
      type: 'array',
      items: { $ref: 'EntityReference' },
      maxItems: 1,
    },
  },
  required: [
    'title',
    'changed',
    'moderation_state',
    'metatag',
    'path',
    'field_intro_text',
    'field_office',
  ],
};
