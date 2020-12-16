/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_accordion_display: { $ref: 'GenericNestedString' },
    field_q_as: { type: 'array', items: { $ref: 'GenericNestedString' } },
  },
  required: ['field_accordion_display', 'field_q_as'],
};
