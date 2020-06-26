const { paragraph, blockContent } = require('../helpers');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { type: 'string', enum: ['paragraph-alert'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { type: 'string' },
        entityBundle: { type: 'string' },
        fieldAlertType: { type: 'string' },
        fieldAlertHeading: { type: ['string', 'null'] },
        fieldVaParagraphs: {
          type: ['array', 'null'],
          items: paragraph(),
        },
        fieldAlertBlockReference: {
          type: ['array', 'null'],
          items: blockContent(),
        },
      },
      required: [
        'entityType',
        'entityBundle',
        'fieldAlertType',
        'fieldAlertHeading',
        'fieldVaParagraphs',
        'fieldAlertBlockReference',
      ],
    },
  },
  required: ['contentModelType', 'entity'],
};
