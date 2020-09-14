module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['file'] },
    filename: { type: 'string' },
    url: { type: 'string' },
  },
  required: ['url', 'filename'],
};
