/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    changed: { $ref: 'GenericNestedString' },
    field_q_as: { type: 'array', items: { $ref: 'GenericNestedString' } },
    metatag: { $ref: 'RawMetaTags' },
    name: { $ref: 'GenericNestedString' },
  },
  required: ['changed', 'field_q_as', 'metatag', 'name'],
};
