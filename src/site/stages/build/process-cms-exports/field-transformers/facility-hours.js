// TODO: Clean up - Move this to a bundle-specific transformer

const { combineItemsInIndexedObject } = require('../transformers/helpers');
const { transformer: getDrupalValue } = require('./getDrupalValue');

const transformer = fieldData => ({
  value: combineItemsInIndexedObject(getDrupalValue(fieldData)),
});

const schemaMap = [
  {
    input: {
      items: {
        type: 'object',
        properties: {
          value: {
            type: ['array', 'object'],
            items: {
              type: 'array',
              items: {
                type: 'string',
              },
              minItems: 2,
              maxItems: 2,
            },
            properties: {
              '0': {
                type: 'array',
                items: {
                  type: 'string',
                },
                minItems: 2,
                maxItems: 2,
              },
              '1': {
                type: 'array',
                items: {
                  type: 'string',
                },
                minItems: 2,
                maxItems: 2,
              },
              '2': {
                type: 'array',
                items: {
                  type: 'string',
                },
                minItems: 2,
                maxItems: 2,
              },
              '3': {
                type: 'array',
                items: {
                  type: 'string',
                },
                minItems: 2,
                maxItems: 2,
              },
              '4': {
                type: 'array',
                items: {
                  type: 'string',
                },
                minItems: 2,
                maxItems: 2,
              },
              '5': {
                type: 'array',
                items: {
                  type: 'string',
                },
                minItems: 2,
                maxItems: 2,
              },
              '6': {
                type: 'array',
                items: {
                  type: 'string',
                },
                minItems: 2,
                maxItems: 2,
              },
              caption: {
                type: 'string',
              },
            },
            required: ['0', '1', '2', '3', '4', '5', '6', 'caption'],
          },
          format: {
            type: 'null',
          },
          caption: {
            type: ['string', 'null'],
          },
        },
        required: ['value', 'format', 'caption'],
      },
      maxItems: 1,
      type: 'array',
    },
    output: [
      {
        type: 'object',
        properties: {
          value: {
            type: 'array',
            items: {
              type: 'array',
              items: { type: 'string' },
              // Expect [0] to be the day name and [1] to be the hours
              minItems: 2,
              maxItems: 2,
            },
            // Expect all the days of the week
            minItems: 7,
            maxItems: 7,
          },
        },
      },
    ],
  },
];

module.exports = { transformer, schemaMap };
