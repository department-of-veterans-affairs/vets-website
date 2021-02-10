/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_link_teaser: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          entity: { $ref: 'input/paragraph-link_teaser' },
        },
      },
    },
    field_media: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          entity: { $ref: 'input/media-image' },
        },
      },
    },
  },
  required: ['field_link_teaser', 'field_media'],
};
