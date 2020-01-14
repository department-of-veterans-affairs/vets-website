module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_local_health_service'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['health_care_local_health_service'] },
        fieldBody: { type: 'string' },
        // This may need to be a $ref: 'transformed/node-regional_health_care_service_des'
        fieldRegionalHealthService: { type: 'object' },
      },
      required: ['fieldBody', 'fieldRegionalHealthService'],
    },
  },
  required: ['entity'],
};
