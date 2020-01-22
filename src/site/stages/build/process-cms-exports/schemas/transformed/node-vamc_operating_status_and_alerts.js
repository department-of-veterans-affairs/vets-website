module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-vamc_operating_status_and_alerts'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['vamc_operating_status_and_alerts'] },
        title: { type: 'string' },
        moderationState: { type: 'string' },
        metatag: { type: 'string' },
        path: { type: 'string' },
        fieldBannerAlert: { type: 'string' },
        fieldFacilityOperatingStatus: { type: 'string' },
        fieldLinks: { type: 'string' },
        fieldOffice: { type: 'string' },
        fieldOperatingStatusEmergInf: { type: 'string' },
      },
      required: [
        'title',
        'moderationState',
        'metatag',
        'path',
        'fieldBannerAlert',
        'fieldFacilityOperatingStatus',
        'fieldLinks',
        'fieldOffice',
        'fieldOperatingStatusEmergInf',
      ],
    },
  },
  required: ['entity'],
};
