const {
  getDrupalValue,
  utcToEpochTime,
  getWysiwygString,
  createLink,
  createMetaTagArray,
  isPublished,
  getImageCrop,
} = require('./helpers');
const { mapKeys, camelCase } = require('lodash');
const assert = require('assert');
const moment = require('moment');

function toUtc(timeString) {
  const time = moment.utc(timeString);
  assert(
    time.isValid(),
    `Expected timeString to be a moment-parsable string. Found ${timeString}`,
  );
  return time.format('YYYY-MM-DD kk:mm:ss [UTC]');
}

function toUtcTz(timeString) {
  const time = moment.utc(timeString);
  assert(
    time.isValid(),
    `Expected timeString to be a moment-parsable string. Found ${timeString}`,
  );
  return time.format('YYYY-MM-DDTkk:mm:ss');
}

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'event',
  title: getDrupalValue(entity.title),
  // Unsure why this was in the transformer in the first place, but it's possibly used in the templates somewhere?
  // uid: entity.uid[0],
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  // TODO: Verify this is how to derive the entityPublished state
  entityPublished: isPublished(getDrupalValue(entity.status)),
  fieldAdditionalInformationAbo: entity.fieldAdditionalInformationAbo.value
    ? {
        processed: getWysiwygString(
          getDrupalValue(entity.fieldAdditionalInformationAbo),
        ),
      }
    : null,
  // The keys of fieldAddress[0] are snake_case, but we want camelCase
  fieldAddress: entity.fieldAddress[0]
    ? mapKeys(entity.fieldAddress[0], (v, k) => camelCase(k))
    : null,
  fieldBody: {
    processed: getWysiwygString(getDrupalValue(entity.fieldBody)),
  },
  fieldDate: {
    startDate: toUtc(entity.fieldDate[0].value),
    value: toUtcTz(entity.fieldDate[0].value),
    endDate: toUtc(entity.fieldDate[0].end_value),
    endValue: toUtcTz(entity.fieldDate[0].end_value),
  },
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldEventCost: getDrupalValue(entity.fieldEventCost),
  fieldEventCta: getDrupalValue(entity.fieldEventCta),
  fieldEventRegistrationrequired: getDrupalValue(
    entity.fieldEventRegistrationrequired,
  ),
  fieldFacilityLocation: entity.fieldFacilityLocation[0] || null,
  fieldLink: createLink(entity.fieldLink, ['url']),
  fieldLocationHumanreadable: getDrupalValue(entity.fieldLocationHumanreadable),
  fieldMedia:
    entity.fieldMedia && entity.fieldMedia.length
      ? { entity: getImageCrop(entity.fieldMedia[0], '_72MEDIUMTHUMBNAIL') }
      : null,
  status: getDrupalValue(entity.status),
});

module.exports = {
  filter: [
    'title',
    // 'uid',
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
    'status',
  ],
  transform,
};
