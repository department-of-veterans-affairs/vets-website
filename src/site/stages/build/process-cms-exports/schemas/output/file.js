module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['file'] },
    derivative: {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
      required: ['url'],
    },
  },
  required: ['derivative'],
};
