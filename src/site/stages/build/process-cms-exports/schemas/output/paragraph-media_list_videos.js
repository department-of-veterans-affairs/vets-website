module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-media_list_videos'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['media_list_videos'] },
        fieldSectionHeader: { type: 'string' },
        fieldVideos: { type: 'array', items: { $ref: 'output/media-video' } },
      },
      required: ['fieldSectionHeader', 'fieldVideos'],
    },
  },
  required: ['entity'],
};
