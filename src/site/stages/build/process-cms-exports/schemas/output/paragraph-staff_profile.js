const { partialSchema } = require('../../transformers/helpers');
const personProfileSchema = require('./node-person_profile');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-staff_profile'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['staff_profile'] },
        entityPublished: { type: 'boolean' },
        queryFieldStaffProfile: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              maxItems: 1,
              items: {
                oneOf: [
                  {
                    entity: partialSchema(personProfileSchema, [
                      'contentModelType',
                      'entityType',
                      'entityBundle',
                      'title',
                      'entityMetatags',
                      'entityPublished',
                      'fieldBody',
                      'fieldDescription',
                      'fieldEmailAddress',
                      'fieldLastName',
                      'fieldMedia',
                      'fieldNameFirst',
                      'fieldOffice',
                      'fieldPhoneNumber',
                      'fieldSuffix',
                      'fieldIntroText',
                      'fieldPhotoAllowHiresDownload',
                      'changed',
                      'status',
                      'fieldCompleteBiography',
                      'entityUrl',
                    ]),
                  },
                  { type: 'null' },
                ],
              },
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
