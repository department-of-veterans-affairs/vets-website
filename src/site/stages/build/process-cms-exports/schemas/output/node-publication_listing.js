module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-publication_listing'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['publication_listing'] },
    title: { type: 'string' },
    changed: { type: 'number' },
    entityPublished: { type: 'boolean' },
    entityMetatags: { $ref: 'MetaTags' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldIntroText: { type: 'string' },
    fieldOffice: { $ref: 'output/node-office' },
  },
  required: [
    'title',
    'changed',
    'entityPublished',
    'entityMetatags',
    'entityUrl',
    'fieldIntroText',
    'fieldOffice',
  ],
};
