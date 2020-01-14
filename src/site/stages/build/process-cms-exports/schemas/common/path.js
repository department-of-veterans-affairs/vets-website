module.exports = {
  $id: 'RawPath',
  type: 'array',
  maxItems: 1,
  items: {
    type: 'object',
    properties: {
      alias: { type: ['string', 'null'] },
    },
    required: ['alias'],
  },
};
