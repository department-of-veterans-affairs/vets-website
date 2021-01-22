module.exports = {
  type: 'object',
  properties: {
    contentModelType: { type: 'string', enum: ['paragraph-situation_update'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { type: 'string' },
        entityBundle: { type: 'string' },
        fieldDateAndTime: {
          type: 'object',
          // These properties are strings resembling dates
          properties: {
            date: { type: 'string' },
            value: { type: 'string' },
          },
        },
        fieldDatetimeRangeTimezone: {
          type: 'object',
          properties: {
            value: { type: 'string' },
            endValue: { type: 'string' },
            timezone: { type: 'string' },
          },
        },
        fieldSendEmailToSubscribers: { type: ['boolean'] },
        fieldWysiwyg: {
          type: 'object',
          properties: {
            processed: { type: 'string' },
          },
        },
      },
      required: [
        'entityType',
        'entityBundle',
        'fieldDateAndTime',
        'fieldDatetimeRangeTimezone',
        'fieldSendEmailToSubscribers',
        'fieldWysiwyg',
      ],
    },
  },
  required: ['contentModelType', 'entity'],
};
