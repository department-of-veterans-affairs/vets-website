module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['fieldWysiwyg'],
      properties: {
        fieldWysiwyg: {
          type: 'object',
          properties: {
            processed: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  required: ['entity'],
};
