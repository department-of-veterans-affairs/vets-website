module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-staff_profile'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['staff_profile'] },
        fieldStaffProfile: { type: 'string' },
      },
      required: ['fieldStaffProfile'],
    },
  },
  required: ['entity'],
};
