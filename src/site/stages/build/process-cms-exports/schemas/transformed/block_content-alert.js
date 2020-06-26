const { paragraph } = require('../helpers');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['block_content-alert'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['block_content'] },
        entityBundle: { enum: ['alert'] },
        fieldAlertContent: paragraph(),
        fieldAlertDismissable: { type: ['boolean', 'null'] },
        fieldAlertTitle: { type: 'string' },
        fieldAlertType: { type: 'string' },
        fieldReusability: { type: 'string' },
      },
      required: [
        'fieldAlertContent',
        'fieldAlertDismissable',
        'fieldAlertTitle',
        'fieldAlertType',
        'fieldReusability',
      ],
    },
  },
  required: ['entity'],
};
