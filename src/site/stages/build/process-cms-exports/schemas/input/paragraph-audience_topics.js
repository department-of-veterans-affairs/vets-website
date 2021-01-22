/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_audience_beneficiares: {
      type: 'array',
      items: {
        oneOf: [{ $ref: 'EntityReference' }, { type: 'array', maxItems: 0 }],
      },
    },
    field_topics: {
      type: 'array',
      items: {
        oneOf: [{ $ref: 'EntityReference' }, { type: 'array', maxItems: 0 }],
      },
    },
  },
  required: ['field_audience_beneficiares', 'field_topics'],
};
