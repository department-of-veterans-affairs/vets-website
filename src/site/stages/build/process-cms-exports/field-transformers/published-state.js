const { isPublished } = require('../transformers/helpers');
const { transformer: getDrupalValue } = require('./getDrupalValue');

const transformer = fieldData => isPublished(getDrupalValue(fieldData));

const schemaMap = [
  {
    input: { $ref: 'GenericNestedString' },
    output: [{ title: 'published-state', type: 'boolean' }],
  },
];

module.exports = { transformer, schemaMap };
