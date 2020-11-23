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
          oneOf: [
            {
              $ref: 'output/node-regional_health_care_service_des',
            },
            { type: 'null' },
          ],
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
      ],
    },
  },
  required: ['entity'],
};
