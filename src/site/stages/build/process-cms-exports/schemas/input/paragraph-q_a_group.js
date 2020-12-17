/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_accordion_display: { $ref: 'GenericNestedBoolean' },
    field_q_as: { type: 'array', items: { $ref: 'EntityReference' } },
  },
  required: ['field_accordion_display', 'field_q_as'],
};
