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
        path: { type: ['string', 'null'] },
      },
      required: ['path'],
    },
    fieldBody: { type: ['string', 'null'] },
    fieldDescription: { type: ['string', 'null'] },
    fieldEmailAddress: { type: ['string', 'null'] },
    fieldLastName: { type: 'string' },
    fieldMedia: { $ref: 'Media' },
    fieldNameFirst: { type: 'string' },
    // This isn't a node-office $ref because we only want
    // some of the properties in the entity
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
    fieldPhoneNumber: { type: ['string', 'null'] },
    fieldSuffix: { type: ['string', 'null'] },
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
