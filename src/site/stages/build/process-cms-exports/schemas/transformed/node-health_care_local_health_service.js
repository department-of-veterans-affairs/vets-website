module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_local_health_service'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['health_care_local_health_service'] },
        fieldBody: { $ref: 'ProcessedString' },
        fieldRegionalHealthService: {
          $ref: 'transformed/node-regional_health_care_service_des',
        },
      },
      required: ['fieldBody', 'fieldRegionalHealthService'],
    },
  },
  required: ['entity'],
};
