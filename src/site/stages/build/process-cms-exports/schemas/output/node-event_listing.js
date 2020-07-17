module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-event_listing'] },
    entityBundle: { enum: ['event_listing'] },
    entityType: { enum: ['node'] },
    entityUrl: { $ref: 'EntityUrl' },
    title: { type: 'string' },
    changed: { type: 'number' },
    entityMetatags: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          __typename: { type: 'string' },
          key: { type: 'string' },
          value: { type: 'string' },
        },
      },
    },
    fieldIntroText: { type: 'string' },
    fieldOffice: {
      $ref: 'transformed/node-office',
    },
  },
  required: [
    'title',
    'changed',
    'entityMetatags',
    'entityUrl',
    'fieldIntroText',
    'fieldOffice',
  ],
};
