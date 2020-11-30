module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['q_a'] },
    title: { type: 'string' },
  },
  required: [
    'title',
  ],
};
