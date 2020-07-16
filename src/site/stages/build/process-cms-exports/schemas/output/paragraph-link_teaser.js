module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['fieldLink', 'fieldLinkSummary'],
      properties: {
        fieldLink: {
          type: ['object', 'null'],
          properties: {
            url: {
              type: 'object',
              required: ['path'],
              properties: {
                path: { type: 'string' },
              },
            },
            title: { type: 'string' },
            options: { type: 'array' },
          },
        },
        fieldLinkSummary: {
          type: ['string', 'null'],
        },
      },
    },
  },
  required: ['entity'],
};
