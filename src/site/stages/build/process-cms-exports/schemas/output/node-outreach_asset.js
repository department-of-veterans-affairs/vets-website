module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['outreach_asset'] },
    title: { type: 'string' },
    created: { type: 'number' },
    changed: { type: 'number' },
    moderationState: { type: 'string' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldBenefits: { type: ['string', 'null'] },
    fieldDescription: { type: 'string' },
    fieldFormat: { type: 'string' },
    fieldListing: { $ref: 'output/node-publication_listing' },
    fieldMedia: {
      oneOf: [
        {
          type: 'object',
          properties: {
            entity: { $ref: 'output/media-video' },
          },
        },
        {
          type: 'object',
          properties: {
            entity: { $ref: 'output/media-image' },
          },
        },
        {
          type: 'object',
          properties: {
            entity: { $ref: 'output/media-document' },
          },
        },
      ],
    },
  },
  required: [
    'title',
    'created',
    'changed',
    'moderationState',
    'entityMetatags',
    'fieldAdministration',
    'fieldBenefits',
    'fieldDescription',
    'fieldFormat',
    'fieldMedia',
  ],
};
