module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-news_story'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['news_story'] },
    title: { type: 'string' },
    created: { type: 'number' },
    promote: { type: 'boolean' },
    entityPublished: { type: 'boolean' },
    entityMetatags: { $ref: 'MetaTags' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldAuthor: {
      oneOf: [{ $ref: 'transformed/node-person_profile' }, { type: 'null' }],
    },
    fieldFullStory: {
      type: 'object',
      properties: {
        processed: { type: 'string' },
      },
    },
    fieldImageCaption: { type: ['string', 'null'] },
    fieldIntroText: { type: 'string' },
    fieldMedia: { oneOf: [{ $ref: 'Media' }, { type: 'null' }] },
    fieldOffice: {
      oneOf: [
        { $ref: 'transformed/node-health_care_region_page' },
        { type: 'null' },
      ],
    },
  },
  required: [
    'title',
    'created',
    'promote',
    'entityPublished',
    'entityMetatags',
    'entityUrl',
    'fieldAuthor',
    'fieldFullStory',
    'fieldImageCaption',
    'fieldIntroText',
    'fieldMedia',
    'fieldOffice',
  ],
};
