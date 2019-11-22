module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['fieldTable'],
      fieldTable: {
        type: 'object',
        required: ['tableValue', 'value'],
        properties: {
          tableValue: {
            type: 'string',
          },
          value: {
            type: 'array',
          },
        },
      },
    },
  },
};
