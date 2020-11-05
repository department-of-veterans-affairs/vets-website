const { partialSchema } = require('../../transformers/helpers');
const personProfileSchema = require('./node-person_profile');
const healthCareLocalFacilitySchema = require('./node-health_care_local_facility');
const newsStorySchema = require('./node-news_story');
const eventSchema = require('./node-event');
const pressRelease = require('./node-press_release');

const socialMediaSchema = {
  type: ['object', 'null'],
  properties: {
    url: {
      type: 'object',
      properties: {
        path: { type: 'string' },
      },
      required: ['path'],
    },
    title: { type: 'string' },
  },
  required: ['url', 'title'],
};

const facilitiesSchema = {
  type: 'object',
  properties: {
    entities: {
      type: 'array',
      items: {
        entity: partialSchema(healthCareLocalFacilitySchema, [
          'entityUrl',
          'entityBundle',
          'title',
          'changed',
          'fieldOperatingStatusFacility',
          'fieldFacilityLocatorApiId',
          'fieldNicknameForThisFacility',
          'fieldIntroText',
          'fieldLocationServices',
          'fieldAddress',
          'fieldPhoneNumber',
          'fieldMentalHealthPhone',
          'fieldFacilityHours',
          'fieldMainLocation',
          'fieldMedia',
        ]),
      },
    },
  },
};

const eventTeasersSchema = max => ({
  type: 'object',
  properties: {
    entities: {
      type: 'array',
      maxItems: max,
      items: {
        entity: partialSchema(eventSchema, [
          'title',
          'fieldDate',
          'fieldDescription',
          'fieldLocationHumanreadable',
          'fieldFacilityLocation',
          'entityUrl',
        ]),
      },
    },
  },
});

const newsTeasersSchema = max => ({
  type: 'object',
  properties: {
    entities: {
      type: 'array',
      maxItems: max,
      items: {
        entity: partialSchema(newsStorySchema, [
          'title',
          'fieldFeatured',
          'fieldIntroText',
          'fieldMedia',
          'entityUrl',
        ]),
      },
    },
  },
});

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_region_page'] },

    entityType: { enum: ['node'] },
    entityBundle: { enum: ['health_care_region_page'] },
    title: { type: 'string' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldGovdeliveryIdEmerg: { type: 'string' },
    fieldGovdeliveryIdNews: { type: 'string' },
    fieldOperatingStatus: socialMediaSchema,
    fieldFacebook: socialMediaSchema,
    fieldFlickr: socialMediaSchema,
    fieldInstagram: socialMediaSchema,
    fieldTwitter: socialMediaSchema,
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
    fieldLeadership: {
      type: 'array',
      items: {
        entity: partialSchema(personProfileSchema, [
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
    reverseFieldRegionPageNode: {
      type: 'object',
      properties: {
        entities: {
          type: 'array',
          items: {
            entity: partialSchema(healthCareLocalFacilitySchema, [
              'title',
              'fieldOperatingStatusFacility',
            ]),
          },
        },
      },
    },
    newsStoryTeasers: newsTeasersSchema(2),
    allNewsStoryTeasers: newsTeasersSchema(500),
    eventTeasers: eventTeasersSchema(2),
    allEventTeasers: eventTeasersSchema(500),
    allPressReleaseTeasers: {
      type: 'object',
      properties: {
        entities: {
          type: 'array',
          maxItems: 100,
          items: {
            entity: partialSchema(pressRelease, [
              'title',
              'fieldReleaseDate',
              'entityUrl',
            ]),
          },
        },
      },
    },
    mainFacilities: facilitiesSchema,
    otherFacilities: facilitiesSchema,
    eventTeasersAll: eventTeasersSchema(1000),
    eventTeasersFeatured: eventTeasersSchema(1000),
    newsStoryTeasersFeatured: newsTeasersSchema(1000),
  },
  required: [
    'title',
    'fieldGovdeliveryIdEmerg',
    'fieldGovdeliveryIdNews',
    'fieldOperatingStatus',
    'fieldFacebook',
    'fieldFlickr',
    'fieldInstagram',
    'fieldTwitter',
    'fieldNicknameForThisFacility',
    'fieldLinkFacilityEmergList',
    'fieldPressReleaseBlurb',
    'fieldLeadership',
    'reverseFieldRegionPageNode',
    'newsStoryTeasers',
    'allNewsStoryTeasers',
    'eventTeasers',
    'allEventTeasers',
    'allPressReleaseTeasers',
    'mainFacilities',
    'otherFacilities',
    'eventTeasersAll',
    'eventTeasersFeatured',
    'newsStoryTeasersFeatured',
  ],
};
