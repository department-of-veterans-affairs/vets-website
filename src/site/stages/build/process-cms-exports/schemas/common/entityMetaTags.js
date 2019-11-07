module.exports = {
  $id: 'MetaTags',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      type: { type: 'string' },
      key: { type: 'string' },
      value: { type: 'string' },
    },
  },
};
