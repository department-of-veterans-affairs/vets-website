module.exports = {
  $id: 'MetaTags',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      __typename: { type: 'string' },
      type: { type: 'string' },
      key: { type: 'string' },
      value: { type: 'string' },
    },
    required: ['key', 'value'],
    oneOf: [{ required: ['__typename'] }, { required: ['type'] }],
  },
};
