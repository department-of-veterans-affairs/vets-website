const { usePartialSchema } = require('../../transformers/helpers');
const personProfileSchema = require('./node-person_profile');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_region_page'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['health_care_region_page'] },
        title: { type: 'string' },
        entityUrl: { $ref: 'EntityUrl' },
        fieldNicknameForThisFacility: { type: ['string', 'null'] },
        fieldLinkFacilityEmergList: {
          type: ['object', 'null'],
          properties: {
            url: {
              type: 'object',
              properties: {
                path: { type: 'string' },
              },
            },
          },
          required: ['url'],
        },
        fieldRelatedLinks: {
          $ref: 'output/paragraph-list_of_link_teasers',
        },
        fieldPressReleaseBlurb: { $ref: 'ProcessedString' },
        entityMetaTags: { $ref: 'MetaTags' },
        fieldLeadership: {
          type: 'array',
          items: {
            /* eslint-disable react-hooks/rules-of-hooks */
            entity: usePartialSchema(personProfileSchema, [
              'entityPublished',
              'title',
              'fieldNameFirst',
              'fieldLastName',
              'fieldSuffix',
              'fieldEmailAddress',
              'fieldPhoneNumber',
              'fieldDescription',
              'fieldOffice',
              'fieldIntroText',
              'fieldPhotoAllowHiresDownload',
              'fieldMedia',
              'fieldBody',
              'changed',
              'entityUrl',
            ]),
          },
        },
      },
      required: [
        'title',
        'fieldNicknameForThisFacility',
        'fieldLinkFacilityEmergList',
        'fieldPressReleaseBlurb',
        'fieldLeadership',
      ],
    },
  },
  required: ['entity'],
};
