/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    path: { $ref: 'GenericNestedString' },
    field_nickname_for_this_facility: { $ref: 'GenericNestedString' },
  },
  required: ['title', 'path', 'field_nickname_for_this_facility'],
};
