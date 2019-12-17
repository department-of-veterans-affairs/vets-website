/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    name: { $ref: 'GenericNestedString' },
    description: { $ref: 'GenericNestedString' },
    parent: { $ref: 'GenericNestedString' },
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
