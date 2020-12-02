module.exports = {
  type: ['object', 'null'],
  properties: {
    entity: {
      type: 'object',
      properties: {
        entityId: { type: 'string' },
        fieldAlertSelection: { type: 'string' },
        fieldAlertNonReusableRef: { type: 'boolean' },
        fieldAlertBlockReference: { $ref: 'output/block_content-alert' },
      },
      required: [
        'entityId',
        'fieldAlertSelection',
        'fieldAlertNonReusableRef',
        'fieldAlertBlockReference',
      ],
    },
  },
  required: ['entity'],
};
