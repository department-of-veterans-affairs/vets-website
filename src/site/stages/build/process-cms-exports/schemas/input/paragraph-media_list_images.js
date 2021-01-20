/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  require: ['field_images', 'field_section_header'],
  properties: {
    field_images: { type: 'array', items: { $ref: 'EntityReference' } },
    field_section_header: { type: 'string' },
  },
};
