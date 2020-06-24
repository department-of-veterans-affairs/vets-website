const { createMetaTagArray } = require('../transformers/helpers');

const transformer = fieldData => createMetaTagArray(fieldData.value);

const schemaMap = [
  {
    input: { $ref: 'RawMetaTags' },
    output: [{ $ref: 'MetaTags' }],
  },
];

module.exports = { transformer, schemaMap };
