module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['fieldLinkTeaser', 'fieldMedia'],
      properties: {
        fieldLinkTeaser: { $ref: 'output/paragraph-link_teaser' },
        fieldMedia: { $ref: 'output/media-image' },
      },
    },
  },
  required: ['entity'],
};
