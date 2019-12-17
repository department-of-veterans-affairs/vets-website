module.exports = {
  $id: 'GenericNestedNumber',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      value: { type: 'number' },
    },
    required: ['value'],
  },
  maxItems: 1,
};
