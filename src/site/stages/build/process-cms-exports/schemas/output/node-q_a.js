module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['q_a'] },
    entityUrl: { $ref: 'EntityUrl' },
    title: { type: 'string' },
  },
  required: ['title'],
};
