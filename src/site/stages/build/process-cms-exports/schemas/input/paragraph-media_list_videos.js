/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  require: ['field_videos', 'field_section_header'],
  properties: {
    field_videos: { type: 'array', items: { $ref: 'EntityReference' } },
    field_section_header: { type: 'string' },
  },
};
