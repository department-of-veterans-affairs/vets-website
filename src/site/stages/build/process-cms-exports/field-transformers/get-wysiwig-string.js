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
  {
    // Input schemas with this should probably use a common schema definition
    input: {
      oneOf: [
        {
          $ref: 'GenericNestedString',
        },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: {
                type: 'null',
              },
            },
          },
        },
      ],
    },
    output: [{ $ref: 'ProcessedString' }],
  },
];

module.exports = { transformer, schemaMap };
