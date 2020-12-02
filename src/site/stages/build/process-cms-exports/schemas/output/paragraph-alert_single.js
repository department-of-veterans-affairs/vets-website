module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: ['object', 'null'],
      properties: {
        entityId: { type: 'string' },
        fieldAlertSelection: { type: 'string' },
        fieldAlertNonReusableRef: {
          oneOf: [{ $ref: 'output/paragraph-alert' }, { type: 'null' }],
        },
        fieldAlertBlockReference: {
          oneOf: [{ $ref: 'output/block_content-alert' }, { type: 'null' }],
        },
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
