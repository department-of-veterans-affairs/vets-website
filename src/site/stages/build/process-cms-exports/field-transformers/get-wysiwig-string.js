const { getWysiwygString } = require('../transformers/helpers');
const { transformer: getDrupalValue } = require('./getDrupalValue');

const transformer = fieldData => ({
  processed: getWysiwygString(getDrupalValue(fieldData)),
});

const schemaMap = [
  {
    input: { $ref: 'GenericNestedString' },
    output: [{ $ref: 'ProcessedString' }],
  },
];

module.exports = { transformer, schemaMap };
