module.exports = {
  type: 'object',
  properties: {
    contentModelType: { type: 'string', enum: ['paragraph-media'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { type: 'string', enum: ['paragraph'] },
        entityBundle: { type: 'string', enum: ['media'] },
        fieldAllowClicksOnThisImage: { type: 'boolean' },
        fieldMedia: { $ref: 'Media' },
      },
      required: [
        'entityType',
        'entityBundle',
        'fieldAllowClicksOnThisImage',
        'fieldMedia',
      ],
    },
  },
  required: ['entity'],
};
