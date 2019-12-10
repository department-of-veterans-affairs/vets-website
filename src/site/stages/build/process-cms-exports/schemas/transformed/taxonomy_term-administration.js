module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['taxonomy_term-administration'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['taxonomy_term'] },
        entityBundle: { enum: ['administration'] },
        name: { type: 'string' },
        fieldAcronym: { type: 'string' },
        fieldDescription: { type: 'string' },
        fieldEmailUpdatesLinkText: { type: 'string' },
        fieldEmailUpdatesUrl: { type: 'string' },
        fieldIntroText: { type: 'string' },
        fieldLink: { type: 'string' },
        fieldSocialMediaLinks: { type: 'string' },
      },
      required: [
        'name',
        'fieldAcronym',
        'fieldDescription',
        'fieldEmailUpdatesLinkText',
        'fieldEmailUpdatesUrl',
        'fieldIntroText',
        'fieldLink',
        'fieldSocialMediaLinks',
      ],
    },
  },
  required: ['entity'],
};
