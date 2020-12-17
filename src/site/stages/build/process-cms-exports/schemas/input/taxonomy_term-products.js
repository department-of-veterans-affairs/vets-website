/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    changed: { $ref: 'GenericNestedString' },
    metatag: { $ref: 'RawMetaTags' },
    name: { $ref: 'GenericNestedString' },
  },
  required: ['changed', 'metatag', 'name'],
};
