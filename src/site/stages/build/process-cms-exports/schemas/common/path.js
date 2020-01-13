module.exports = {
  $id: 'path',
  type: 'array',
  maxItems: 1,
  items: {
    type: 'object',
    properties: {
      alias: { type: 'string' },
    },
    required: ['alias'],
  },
};
