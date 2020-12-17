module.exports = {
  type: 'object',
  require: ['name', 'path'],
  properties: {
    name: { $ref: 'GenericNestedString' },
    path: {
      type: 'array',
      items: {
        type: 'object',
        required: ['alias'],
        properties: {
          alias: {
            type: 'string',
          },
        },
      },
    },
  },
};
