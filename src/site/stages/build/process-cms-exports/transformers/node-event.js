const {
  getDrupalValue,
  utcToEpochTime,
  getWysiwygString,
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

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'event',
  title: getDrupalValue(entity.title),
  uid: entity.uid[0],
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  path: getDrupalValue(entity.path),
  fieldAdditionalInformationAbo: getDrupalValue(
    entity.fieldAdditionalInformationAbo,
  ),
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
  fieldFacilityLocation: getDrupalValue(entity.fieldFacilityLocation),
  fieldLink: getDrupalValue(entity.fieldLink),
  fieldLocationHumanreadable: getDrupalValue(entity.fieldLocationHumanreadable),
  fieldMedia: getDrupalValue(entity.fieldMedia),
});

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
  ],
  transform,
};
