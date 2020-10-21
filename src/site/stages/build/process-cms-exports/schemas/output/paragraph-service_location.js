module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['paragraph'] },
    entityBundle: { type: 'string', enum: ['service_location'] },
    fieldServiceLocationAddress: {
      $ref: 'output/paragraph-service_location_address',
    },
    fieldEmailContacts: {
      type: 'array',
      items: {
        entity: {
          fieldEmailAddress: { type: 'string' },
          fieldEmailLabel: { type: 'string' },
        },
      },
    },
    fieldFacilityServiceHours: { type: 'array' },
    fieldHours: { type: 'string' },
    fieldAdditionalHoursInfo: { type: 'string' },
    fieldPhone: {
      type: ['array', 'null'],
      items: {
        $ref: 'output/paragraph-phone_number',
      },
    },
    fieldUseMainFacilityPhone: { type: 'boolean' },
  },
  required: [
    'fieldServiceLocationAddress',
    'fieldEmailContacts',
    'fieldFacilityServiceHours',
    'fieldHours',
    'fieldAdditionalHoursInfo',
    'fieldPhone',
    'fieldUseMainFacilityPhone',
  ],
};
