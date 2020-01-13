module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-person_profile'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['person_profile'] },
    entityUrl: {
      // This one doesn't have a breadcrumb, interestingly enough
      type: 'object',
      properties: {
        path: { type: 'string' },
      },
      required: ['path'],
    },
    fieldBody: { type: ['string', 'null'] },
    fieldDescription: { type: 'string' },
    fieldEmailAddress: { type: ['string', 'null'] },
    fieldLastName: { type: 'string' },
    fieldMedia: { type: ['string', 'null'] },
    fieldNameFirst: { type: 'string' },
    fieldOffice: {
      type: 'object',
      properties: {
        entity: {
          type: 'object',
          properties: {
            entityLabel: { type: 'string' },
            entityType: { type: 'string' },
          },
          required: ['entityLabel', 'entityType'],
        },
      },
      required: ['entity'],
    },
    fieldPhoneNumber: { type: 'string' },
    fieldSuffix: { type: 'string' },
  },
  required: [
    'fieldBody',
    'fieldDescription',
    'fieldEmailAddress',
    'fieldLastName',
    'fieldMedia',
    'fieldNameFirst',
    'fieldOffice',
    'fieldPhoneNumber',
    'fieldSuffix',
  ],
};
