module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-media_list_images'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['media_list_images'] },
        fieldSectionHeader: { type: 'string' },
        fieldImages: { type: 'array', items: { $ref: 'output/media-image' } },
      },
      required: ['fieldSectionHeader', 'fieldImages'],
    },
  },
  required: ['entity'],
};
