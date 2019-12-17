module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['taxonomy_term-health_care_service_taxonomy'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['taxonomy_term'] },
        entityBundle: { enum: ['health_care_service_taxonomy'] },
        name: { type: 'string' },
        description: { type: 'string' },
        parent: { type: 'string' },
        fieldAlsoKnownAs: { type: 'string' },
        fieldCommonlyTreatedCondition: { type: 'string' },
        fieldHealthServiceApiId: { type: 'string' },
      },
      required: [
        'name',
        'description',
        'parent',
        'fieldAlsoKnownAs',
        'fieldCommonlyTreatedCondition',
        'fieldHealthServiceApiId',
      ],
    },
  },
  required: ['entity'],
};
