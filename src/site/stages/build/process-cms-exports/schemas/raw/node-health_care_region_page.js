/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    moderation_state: { $ref: 'GenericNestedString' },
    path: { $ref: 'RawPath' },
    metatag: { $ref: 'RawMetaTags' },
    field_nickname_for_this_facility: { $ref: 'GenericNestedString' },
  },
  required: [
    'title',
    'moderation_state',
    'path',
    'metatag',
    'field_nickname_for_this_facility',
  ],
};
