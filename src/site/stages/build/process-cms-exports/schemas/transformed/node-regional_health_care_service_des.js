module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-regional_health_care_service_des'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['regional_health_care_service_des'] },
        fieldBody: { type: 'string' },
        fieldServiceNameAndDescripti: { type: 'string' },
      },
      required: ['fieldBody', 'fieldServiceNameAndDescripti'],
    },
  },
  required: ['entity'],
};
