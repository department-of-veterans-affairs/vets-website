export const ezrAttachmentsSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
      },
      size: {
        type: 'integer',
      },
      confirmationCode: {
        type: 'string',
      },
    },
  },
};
