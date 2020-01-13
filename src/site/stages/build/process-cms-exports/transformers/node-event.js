const {
  getDrupalValue,
  utcToEpochTime,
  getWysiwygString,
  createLink,
} = require('./helpers');
const { mapKeys, camelCase } = require('lodash');
const assert = require('assert');

function fakeUtc(timeString) {
  // Assume the timeString looks like 2019-05-30T21:00:00
  // If it doesn't, we'll need to do some real conversions; fail for now
  assert(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(timeString),
    `Expected timeString to look like 2019-05-30T21:00:00, but found ${timeString}`,
  );
  return `${timeString.replace('T', ' ')} UTC`;
}

// Same as the createMetaTag in the transformer helpers, but uses
// __typename instead of type. Because consistency.
function createMetaTag(type, key, value) {
  return {
    __typename: type,
    key,
    value,
  };
}

const transform = entity => {
  const metaTags = entity.metatag.value;

  return {
    entityType: 'node',
    entityBundle: 'event',
    title: getDrupalValue(entity.title),
    uid: entity.uid[0],
    changed: utcToEpochTime(getDrupalValue(entity.changed)),
    entityUrl: {
      // TODO: Get the breadcrumb from the CMS export when it's available
      breadcrumb: [],
      path: entity.path[0].alias,
    },
    entityMetatags: [
      createMetaTag('MetaValue', 'title', metaTags.title),
      createMetaTag('MetaValue', 'twitter:card', metaTags.twitter_cards_type),
      createMetaTag('MetaProperty', 'og:site_name', metaTags.og_site_name),
      createMetaTag(
        'MetaValue',
        'twitter:description',
        metaTags.twitter_cards_description,
      ),
      createMetaTag('MetaValue', 'description', metaTags.description),
      createMetaTag('MetaValue', 'twitter:title', metaTags.twitter_cards_title),
      createMetaTag('MetaValue', 'twitter:site', metaTags.twitter_cards_site),
      createMetaTag('MetaProperty', 'og:title', metaTags.og_title),
      createMetaTag('MetaProperty', 'og:description', metaTags.og_description),
      createMetaTag(
        'MetaProperty',
        'og:image:height',
        metaTags.og_image_height,
      ),
    ],
    // TODO: Verify this is how to derive the entityPublished state
    entityPublished: entity.moderationState[0].value === 'published',
    fieldAdditionalInformationAbo: entity.fieldAdditionalInformationAbo.value
      ? {
          processed: getWysiwygString(
            getDrupalValue(entity.fieldAdditionalInformationAbo),
          ),
        }
      : null,
    // The keys of fieldAddress[0] are snake_case, but we want camelCase
    fieldAddress: mapKeys(entity.fieldAddress[0], (v, k) => camelCase(k)),
    fieldBody: {
      processed: getWysiwygString(getDrupalValue(entity.fieldBody)),
    },
    fieldDate: {
      startDate: fakeUtc(entity.fieldDate[0].value),
      value: entity.fieldDate[0].value,
      endDate: fakeUtc(entity.fieldDate[0].end_value),
      endValue: entity.fieldDate[0].end_value,
    },
    fieldDescription: getDrupalValue(entity.fieldDescription),
    fieldEventCost: getDrupalValue(entity.fieldEventCost),
    fieldEventCta: getDrupalValue(entity.fieldEventCta),
    fieldEventRegistrationrequired: getDrupalValue(
      entity.fieldEventRegistrationrequired,
    ),
    fieldFacilityLocation: entity.fieldFacilityLocation[0] || null,
    fieldLink: createLink(entity.fieldLink, ['url']),
    fieldLocationHumanreadable: getDrupalValue(
      entity.fieldLocationHumanreadable,
    ),
    fieldMedia: entity.fieldMedia[0] || null,
  };
};

module.exports = {
  filter: [
    'title',
    'uid',
    'changed',
    'path',
    'field_additional_information_abo',
    'field_address',
    'field_body',
    'field_date',
    'field_description',
    'field_event_cost',
    'field_event_cta',
    'field_event_registrationrequired',
    'field_facility_location',
    'field_link',
    'field_location_humanreadable',
    'field_media',
    'metatag',
    'moderation_state',
  ],
  transform,
};
