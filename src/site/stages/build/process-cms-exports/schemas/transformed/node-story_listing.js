module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-story_listing'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['story_listing'] },
    title: { type: 'string' },
    changed: { type: 'number' },
    entityPublished: { type: 'boolean' },
    entityMetatags: { $ref: 'MetaTags' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldIntroText: { type: 'string' },
    fieldOffice: { $ref: 'transformed/node-office' },
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
