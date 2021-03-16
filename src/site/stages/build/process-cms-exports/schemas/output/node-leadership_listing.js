module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['leadership_listing'] },
    title: { type: 'string' },
    created: { type: 'number' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldDescription: { type: 'string' },
    fieldIntroText: { type: 'string' },
    fieldLeadership: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          entity: { $ref: 'output/node-person_profile' },
        },
        required: ['entity'],
      },
    },
    fieldMetaTitle: { type: 'string' },
    fieldOffice: {
      type: 'object',
      properties: { entity: { $ref: 'output/node-health_care_region_page' } },
    },
  },
  required: [
    'title',
    'created',
    'entityMetatags',
    'fieldAdministration',
    'fieldDescription',
    'fieldIntroText',
    'fieldLeadership',
    'fieldMetaTitle',
    'fieldOffice',
  ],
};
