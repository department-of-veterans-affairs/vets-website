const { usePartialSchema } = require('../../transformers/helpers');
const personProfileSchema = require('./node-person_profile');

module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['leadership_listing'] },
    title: { type: 'string' },
    created: { type: 'number' },
    changed: { type: 'number' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldDescription: { type: 'string' },
    fieldIntroText: { type: 'string' },
    fieldLeadership: { $ref: 'output/node-person_profile' },
    fieldMetaTitle: { type: 'string' },
    fieldOffice: { $ref: 'output/node-health_care_region_page' },
    reverseFieldListingNode: {
      type: 'object',
      properties: {
        entities: {
          type: 'array',
          items: {
            /* eslint-disable react-hooks/rules-of-hooks */
            entity: usePartialSchema(personProfileSchema, [
              'title',
              'fieldNameFirst',
              'fieldLastName',
              'fieldSuffix',
              'fieldDescription',
              'fieldOffice',
              'fieldIntroText',
              'fieldPhotoAllowHiresDownload',
              'fieldBody',
              'changed',
              'entityUrl',
              'fieldMedia',
            ]),
          },
        },
      },
    },
  },
  required: [
    'title',
    'created',
    'changed',
    'entityMetatags',
    'fieldAdministration',
    'fieldDescription',
    'fieldIntroText',
    'fieldLeadership',
    'fieldMetaTitle',
    'fieldOffice',
  ],
};
