module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-table'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['table'] },
        fieldTable: {
          type: 'object',
          required: ['tableValue', 'value'],
          properties: {
            tableValue: {
              type: 'string',
            },
            value: {
              type: 'object',
            },
          },
        },
      },
      required: ['fieldTable'],
    },
  },
  required: ['entity'],
};
