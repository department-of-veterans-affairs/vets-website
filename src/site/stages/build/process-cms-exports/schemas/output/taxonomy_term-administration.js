/* eslint-disable camelcase */

const nullableString = { type: ['string', 'null'] };

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['taxonomy_term-administration'] },
    targetId: { type: 'number' },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['taxonomy_term'] },
        entityBundle: { enum: ['administration'] },
        entityLabel: { type: 'string' },
        name: { type: 'string' },
        fieldAcronym: nullableString,
        fieldDescription: nullableString,
        fieldEmailUpdatesLinkText: nullableString,
        fieldEmailUpdatesUrl: nullableString,
        fieldIntroText: nullableString,
        fieldLink: {
          type: ['object', 'null'],
          properties: {
            url: {
              type: 'object',
              properties: {
                path: { type: 'string' },
              },
            },
          },
        },
        fieldSocialMediaLinks: {
          type: 'object',
          properties: {
            facebook: { type: 'string' },
            instagram: { type: 'string' },
            linkedin: { type: 'string' },
            twitter: { type: 'string' },
            youtube: { type: 'string' },
            youtube_channel: { type: 'string' },
          },
        },
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
  required: ['entity', 'targetId'],
};
