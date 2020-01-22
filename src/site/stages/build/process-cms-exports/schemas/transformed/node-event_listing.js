module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-event_listing'] },
    entityBundle: { enum: ['event_listing'] },
    entityType: { enum: ['node'] },
    entityUrl: {
      // Probably should pull this out into a common schema
      type: 'object',
      properties: {
        breadcrumb: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              url: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                  routed: { type: 'boolean' },
                },
                required: ['path', 'routed'],
              },
              text: { type: 'string' },
            },
            required: ['url', 'text'],
          },
        },
        path: { type: 'string' },
      },
      required: ['breadcrumb', 'path'],
    },
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
