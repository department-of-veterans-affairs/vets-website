/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    image: {
      type: 'array',
      items: {
        allOf: [
          { $ref: 'EntityReference' },
          {
            type: 'object',
            properties: {
              alt: { type: 'string' },
              title: { type: 'string' },
              width: { type: 'number' },
              height: { type: 'number' },
            },
            required: ['alt', 'width', 'height'],
          },
        ],
      },
      maxItems: 1,
    },
  },
  required: ['image'],
};
