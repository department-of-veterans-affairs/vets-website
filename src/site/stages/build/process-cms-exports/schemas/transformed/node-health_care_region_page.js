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
        entityUrl: {
          type: 'object',
          properties: {
            // TODO: add breadcrumb
            path: { type: 'string' },
          },
          required: ['path'],
        },
        fieldNicknameForThisFacility: { type: 'string' },
      },
      required: ['title', 'fieldNicknameForThisFacility'],
    },
  },
  required: ['entity'],
};
