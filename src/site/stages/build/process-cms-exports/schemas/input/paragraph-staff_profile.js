/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_staff_profile: {
      type: 'array',
      maxItems: 1,
      items: {
        $ref: 'EntityReference',
      },
    },
    status: { $ref: 'GenericNestedBoolean' },
  },
  required: ['field_staff_profile', 'status'],
};
