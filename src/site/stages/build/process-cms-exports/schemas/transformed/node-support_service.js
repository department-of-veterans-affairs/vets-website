module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-support_service'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['support_service'] },
        title: { type: 'string' },
        fieldLink: { type: 'string' },
        fieldPhoneNumber: { type: 'string' },
      },
      required: ['title', 'fieldLink', 'fieldPhoneNumber'],
    },
  },
  required: ['entity'],
};
