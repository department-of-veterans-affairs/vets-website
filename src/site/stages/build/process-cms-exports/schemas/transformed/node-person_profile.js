module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-person_profile'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['person_profile'] },
    entityUrl: { $ref: 'EntityUrl' },
    title: {
      type: 'string',
      // This doesn't quite work how I want it to yet
      pattern: { $data: '0/fieldNameFirst 0/fieldLastName' },
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
    'title',
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
