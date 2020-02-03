module.exports = {
  $id: 'RawPath',
  type: 'array',
  maxItems: 1,
  items: {
    type: 'object',
    properties: {
      alias: { type: ['string', 'null'] },
      langcode: { type: 'string' },
      pathauto: { type: 'number' },
    },
    required: ['alias'],
  },
};
