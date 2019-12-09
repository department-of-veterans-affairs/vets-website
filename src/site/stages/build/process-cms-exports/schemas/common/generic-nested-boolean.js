module.exports = {
  $id: 'GenericNestedBoolean',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      value: { type: 'boolean' },
    },
    required: ['value'],
  },
  maxItems: 1,
};
