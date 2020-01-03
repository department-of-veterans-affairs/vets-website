module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_region_page'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['health_care_region_page'] },
        title: { type: 'string' },
        path: { type: 'string' },
        fieldNicknameForThisFacility: { type: 'string' },
      },
      required: ['title', 'path', 'fieldNicknameForThisFacility'],
    },
  },
  required: ['entity'],
};
