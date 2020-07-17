/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_body: { $ref: 'GenericNestedString' },
    field_regional_health_service: {
      type: 'array',
      items: { $ref: 'EntityReference' },
      maxItems: 1,
    },
  },
  required: ['field_body', 'field_regional_health_service'],
};
