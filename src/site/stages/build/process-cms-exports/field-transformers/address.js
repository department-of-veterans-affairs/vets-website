const { mapKeys, camelCase } = require('lodash');

// The keys of the address are snake_case, but we want camelCase
const transformer = fieldData => mapKeys(fieldData[0], (v, k) => camelCase(k));

const schemaMap = [
  {
    input: { $ref: 'RawAddress' },
    output: [{ $ref: 'Address' }],
  },
];

module.exports = { transformer, schemaMap };
