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

function toUtc(timeString, withExplicitUtc = true) {
  const time = moment.utc(timeString);
  assert(
    time.isValid(),
    `Expected timeString to be a moment-parsable string. Found ${timeString}`,
  );
  const formatString = withExplicitUtc
    ? 'YYYY-MM-DD HH:mm:ss [UTC]'
    : 'YYYY-MM-DD[T]HH:mm:ss';
  return time.format(formatString);
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
  fieldAdditionalInformationAbo: entity.fieldAdditionalInformationAbo[0]
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
  // This field is deprecated and can probably be removed
  fieldDate: {
    startDate: toUtc(entity.fieldDate[0]?.value),
    value: toUtc(entity.fieldDate[0]?.value, false),
    // eslint-disable-next-line camelcase
    endDate: toUtc(entity.fieldDate[0]?.end_value),
    // eslint-disable-next-line camelcase
    endValue: toUtc(entity.fieldDate[0]?.end_value, false),
  },
  // The templates expect timestamps, like we get from graphql,
  // but the cms-export gives us UTC dates.
  fieldDatetimeRangeTimezone:
    entity.fieldDatetimeRangeTimezone &&
    entity.fieldDatetimeRangeTimezone.length
      ? {
          value: entity.fieldDatetimeRangeTimezone[0].value
            ? utcToEpochTime(entity.fieldDatetimeRangeTimezone[0].value)
            : null,
          endValue: entity.fieldDatetimeRangeTimezone[0].end_value
            ? utcToEpochTime(entity.fieldDatetimeRangeTimezone[0].end_value)
            : null,
          timezone: entity.fieldDatetimeRangeTimezone[0].timezone,
        }
      : {},
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldEventCost: getDrupalValue(entity.fieldEventCost),
  fieldEventCta: getDrupalValue(entity.fieldEventCta),
  fieldEventRegistrationrequired: getDrupalValue(
    entity.fieldEventRegistrationrequired,
  ),
  fieldFacilityLocation:
    entity.fieldFacilityLocation && entity.fieldFacilityLocation.length
      ? {
          entity: {
            entityUrl: entity.fieldFacilityLocation[0].entityUrl,
            title: entity.fieldFacilityLocation[0].title,
            fieldFacilityLocatorApiId:
              entity.fieldFacilityLocation[0].fieldFacilityLocatorApiId,
          },
        }
      : null,
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
    'field_datetime_range_timezone',
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
