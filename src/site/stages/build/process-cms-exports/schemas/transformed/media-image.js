module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['media-image'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['media'] },
        entityBundle: { enum: ['image'] },
        image: {
          type: 'object',
          properties: {
            alt: { type: 'string' },
            title: { type: 'string' },
            url: { type: 'string' },
            derivative: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                width: { type: 'number' },
                height: { type: 'number' },
              },
              required: ['url', 'width', 'height'],
            },
          },
          required: ['alt', 'title', 'url', 'derivative'],
        },
      },
      required: ['image'],
    },
  },
  required: ['entity'],
};
