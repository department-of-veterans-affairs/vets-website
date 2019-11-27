module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['fieldLink', 'fieldLinkSummary'],
      properties: {
        fieldLink: {
          type: 'object',
          required: ['url', 'title', 'options'],
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
          type: 'string',
        },
      },
    },
  },
  required: ['entity'],
};
