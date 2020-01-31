module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-publication_listing'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['publication_listing'] },
        title: { type: 'string' },
        changed: { type: 'number' },
        entityMetatags: { $ref: 'MetaTags' },
        entityUrl: { $ref: 'EntityUrl' },
        fieldIntroText: { type: 'string' },
        fieldOffice: { $ref: 'transformed/node-office' },
      },
      required: [
        'title',
        'changed',
        'entityMetatags',
        'entityUrl',
        'fieldIntroText',
        'fieldOffice',
      ],
    },
  },
  required: ['entity'],
};
