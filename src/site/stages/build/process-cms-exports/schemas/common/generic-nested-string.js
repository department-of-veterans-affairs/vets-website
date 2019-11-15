module.exports = {
  $id: 'GenericNestedString',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      value: { type: 'string' },
    },
    required: ['value'],
  },
  maxItems: 1,
};
