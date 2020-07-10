module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-staff_profile'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['staff_profile'] },
        queryFieldStaffProfile: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              maxItems: 1,
              items: { $ref: 'output/node-person_profile' },
            },
          },
          required: ['entities'],
        },
      },
      required: ['queryFieldStaffProfile'],
    },
  },
  required: ['entity'],
};
