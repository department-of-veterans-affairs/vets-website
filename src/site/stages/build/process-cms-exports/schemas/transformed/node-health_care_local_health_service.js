const healthCareServiceDesk = require('./node-regional_health_care_service_des');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_local_health_service'] },
    entity: {
      type: 'object',
      $expand: true,
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['health_care_local_health_service'] },
        fieldBody: { $ref: 'ProcessedString' },
        fieldRegionalHealthService: healthCareServiceDesk,
      },
      required: ['fieldBody', 'fieldRegionalHealthService'],
    },
  },
  required: ['entity'],
};
