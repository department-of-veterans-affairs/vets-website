// TODO: Move this function here once we replace the content model transformers
// with these field transformers.
const { getDrupalValue } = require('../transformers/helpers');

const schemaMap = [
  {
    input: { $ref: 'GenericNestedString' },
    output: [
      { type: 'string' },
      {
        oneOf: [
          {
            $ref: 'ProcessedString',
          },
          {
            type: 'null',
          },
        ],
      },
      // Unsure about this one
      {
        $ref: 'ProcessedString',
      },
      {
        type: ['string', 'null'],
      },
      // This probably shouldn't have GenericNestedString as the input schema,
      // but it's already in use like that
      {
        type: 'number',
      },
    ],
  },
  {
    // Input schemas with this should probably use a common schema definition
    input: {
      items: {
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
          format: {
            type: 'string',
          },
        },
        required: ['value', 'format'],
      },
      maxItems: 1,
      type: 'array',
    },
    output: [{ type: 'number' }],
  },
  {
    input: { $ref: 'GenericNestedBoolean' },
    output: [{ type: 'boolean' }],
  },
  {
    input: {
      maxItems: 0,
      type: 'array',
    },
    output: [{ type: 'null' }, { type: ['string', 'null'] }],
  },
];

module.exports = { transformer: getDrupalValue, schemaMap };
