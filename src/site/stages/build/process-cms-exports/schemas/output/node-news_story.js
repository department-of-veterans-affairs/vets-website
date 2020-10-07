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
      oneOf: [
        {
          type: 'object',
          properties: {
            title: { type: 'string' },
            fieldDescription: { type: ['string', 'null'] },
          },
        },
        { type: 'null' },
      ],
    },
    fieldFullStory: { $ref: 'ProcessedString' },
    fieldImageCaption: { type: ['string', 'null'] },
    fieldIntroText: { type: 'string' },
    fieldListing: {
      type: 'object',
      properties: {
        entity: {
          type: 'object',
          properties: {
            entityUrl: { $ref: 'EntityUrl' },
          },
        },
      },
    },
    fieldMedia: { oneOf: [{ $ref: 'Media' }, { type: 'null' }] },
    fieldOffice: {
      oneOf: [
        {
          type: 'object',
          properties: {
            entity: { $ref: 'output/node-health_care_region_page' },
          },
        },
        { type: 'null' },
      ],
    },
    status: { type: 'boolean' },
    fieldFeatured: { type: 'boolean' },
    // uid is present in GraphQL output, but some uids don't exist ignoring for now
    // uid: {
    //   oneOf: [{ type: 'null' }, { $ref: 'output/user' }],
    // },
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
    'status',
    'fieldFeatured',
    // 'uid',
  ],
};
