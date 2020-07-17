module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-support_service'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['support_service'] },
        title: { type: 'string' },
        fieldLink: {
          type: ['object', 'null'],
          properties: {
            url: {
              type: 'object',
              properties: {
                path: { type: 'string' },
              },
              required: ['path'],
            },
            title: { type: 'string' },
            options: { type: 'array' },
          },
          required: ['url', 'title', 'options'],
        },
        fieldPhoneNumber: { type: ['string', 'null'] },
      },
      required: ['title', 'fieldLink', 'fieldPhoneNumber'],
    },
  },
  required: ['entity'],
};
