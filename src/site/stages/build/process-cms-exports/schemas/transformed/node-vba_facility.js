module.exports = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    // TODO: Fill this in with the real data; I'm just guessing
    fieldAdministration: {
      type: 'object',
      properties: {
        fieldDescription: { type: 'string' },
      },
      required: ['fieldDescription'],
    },
    fieldFacilityLocatorApiId: { type: 'string' },
    fieldOperatingStatusFacility: { type: 'string' },
    fieldOperatingStatusMoreInfo: { type: 'string' },
  },
  required: [
    'title',
    'fieldAdministration',
    'fieldFacilityLocatorApiId',
    'fieldOperatingStatusFacility',
    'fieldOperatingStatusMoreInfo',
  ],
};
