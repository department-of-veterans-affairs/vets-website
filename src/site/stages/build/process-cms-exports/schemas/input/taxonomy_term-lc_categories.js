module.exports = {
  type: 'object',
  require: ['name'],
  properties: {
    name: { $ref: 'GenericNestedString' },
  },
};
