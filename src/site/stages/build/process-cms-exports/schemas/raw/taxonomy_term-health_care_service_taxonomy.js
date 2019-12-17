/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    name: { $ref: 'GenericNestedString' },
    description: {
      oneOf: [
        { $ref: 'GenericNestedString' },
        {
          type: 'array',
          items: { type: 'object', properties: { value: { type: 'null' } } },
        },
      ],
    },
    parent: {
      type: 'array',
      maxItems: 1,
      items: {
        anyOf: [
          { $ref: 'EntityReference' },
          {
            type: 'object',
            required: ['target_id'],
          },
        ],
      },
    },
    field_also_known_as: { $ref: 'GenericNestedString' },
    field_commonly_treated_condition: { $ref: 'GenericNestedString' },
    field_health_service_api_id: { $ref: 'GenericNestedString' },
  },
  required: [
    'name',
    'description',
    'parent',
    'field_also_known_as',
    'field_commonly_treated_condition',
    'field_health_service_api_id',
  ],
};
