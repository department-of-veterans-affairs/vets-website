module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-event_listing'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['event_listing'] },
        title: { type: 'string' },
        changed: { type: 'string' },
        metatag: { type: 'string' },
        path: { type: 'string' },
        fieldIntroText: { type: 'string' },
        fieldOffice: { type: 'string' },
      },
      required: ['title', 'changed', 'metatag', 'path', 'fieldIntroText', 'fieldOffice'],
    },
  },
  required: ['entity'],
};
