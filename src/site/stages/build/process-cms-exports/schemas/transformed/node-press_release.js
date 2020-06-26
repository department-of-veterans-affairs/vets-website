const hcRegionPage = require('./node-health_care_region_page');
const { media } = require('../helpers');
const personProfile = require('./node-person_profile');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-press_release'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['press_release'] },
    title: { type: 'string' },
    entityMetatags: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          __typename: { type: 'string' },
          key: { type: 'string' },
          value: { type: 'string' },
        },
        required: ['__typename', 'key', 'value'],
      },
    },
    entityUrl: { $ref: 'EntityUrl' },
    fieldAddress: { $ref: 'Address' },
    fieldIntroText: { type: 'string' },
    fieldOffice: hcRegionPage,
    fieldPdfVersion: media(),
    fieldPressReleaseContact: {
      type: 'array',
      maxItems: 1,
      items: {
        type: 'object',
        properties: {
          entity: personProfile,
        },
        required: ['entity'],
      },
    },
    fieldPressReleaseDownloads: { type: 'array', maxItems: 0 },
    fieldPressReleaseFulltext: { $ref: 'ProcessedString' },
    fieldReleaseDate: {
      type: 'object',
      // These properties are strings resembling dates
      properties: {
        value: { type: 'string' },
        date: { type: 'string' },
      },
      required: ['value', 'date'],
    },
  },
  required: [
    'title',
    'entityUrl',
    'fieldAddress',
    'fieldIntroText',
    'fieldOffice',
    'fieldPdfVersion',
    'fieldPressReleaseContact',
    'fieldPressReleaseDownloads',
    'fieldPressReleaseFulltext',
    'fieldReleaseDate',
  ],
};
