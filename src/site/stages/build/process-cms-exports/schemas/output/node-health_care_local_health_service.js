const { partialSchema } = require('../../transformers/helpers');
const healthCareLocalFacilitySchema = require('./node-health_care_local_facility');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_local_health_service'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['health_care_local_health_service'] },
        title: { type: 'string' },
        fieldBody: { $ref: 'ProcessedString' },
        fieldRegionalHealthService: {
          type: 'object',
          items: {
            entity: {
              type: { $ref: 'output/node-regional_health_care_service_des' },
            },
          },
        },
        fieldServiceLocation: {
          type: 'array',
          items: {
            entity: {
              type: { $ref: 'output/paragraph-service_location' },
            },
          },
        },
        fieldOnlineSchedulingAvailabl: { type: ['string', 'null'] },
        fieldReferralRequired: { type: ['string', 'null'] },
        fieldWalkInsAccepted: { type: ['string', 'null'] },
        fieldPhoneNumbersParagraph: { type: 'array' },
        fieldFacilityLocation: {
          type: 'object',
          items: {
            entity: partialSchema(healthCareLocalFacilitySchema, [
              'entityUrl',
              'fieldNicknameForThisFacility',
              'title',
            ]),
          },
        },
      },
      required: [
        'title',
        'fieldBody',
        'fieldRegionalHealthService',
        'fieldServiceLocation',
        'fieldOnlineSchedulingAvailabl',
        'fieldReferralRequired',
        'fieldWalkInsAccepted',
        'fieldPhoneNumbersParagraph',
        'fieldFacilityLocation',
      ],
    },
  },
  required: ['entity'],
};
