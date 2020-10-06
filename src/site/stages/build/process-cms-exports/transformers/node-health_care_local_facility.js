const {
  getDrupalValue,
  isPublished,
  createMetaTagArray,
  combineItemsInIndexedObject,
  utcToEpochTime,
} = require('./helpers');
const { mapKeys, camelCase } = require('lodash');

const getSocialMediaObject = ({ uri, title }) =>
  uri
    ? {
        url: { path: uri },
        title,
      }
    : null;

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'health_care_local_facility',
  title: getDrupalValue(entity.title),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityPublished: isPublished(getDrupalValue(entity.status)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  // The keys of fieldAddress[0] are snake_case, but we want camelCase
  fieldAddress: mapKeys(entity.fieldAddress[0], (v, k) => camelCase(k)),
  fieldEmailSubscription: getDrupalValue(entity.fieldEmailSubscription),
  fieldFacebook: getSocialMediaObject(entity.fieldFacebook),
  fieldFacilityHours: {
    value: combineItemsInIndexedObject(
      getDrupalValue(entity.fieldFacilityHours),
    ),
  },
  fieldFacilityLocatorApiId: getDrupalValue(entity.fieldFacilityLocatorApiId),
  fieldFlickr: getSocialMediaObject(entity.fieldFlickr),
  fieldInstagram: getSocialMediaObject(entity.fieldInstagram),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldLocalHealthCareService: entity.fieldLocalHealthCareService.length
    ? entity.fieldLocalHealthCareService.filter(n => Object.keys(n).length)
    : null,
  fieldLocationServices: entity.fieldLocationServices.length
    ? entity.fieldLocationServices
    : null,
  fieldMainLocation: getDrupalValue(entity.fieldMainLocation),
  fieldMedia:
    entity.fieldMedia && entity.fieldMedia.length
      ? { entity: entity.fieldMedia[0] }
      : null,
  fieldMentalHealthPhone: getDrupalValue(entity.fieldMentalHealthPhone),
  fieldNicknameForThisFacility: getDrupalValue(
    entity.fieldNicknameForThisFacility,
  ),
  fieldOperatingStatusFacility: getDrupalValue(
    entity.fieldOperatingStatusFacility,
  ),
  fieldOperatingStatusMoreInfo: getDrupalValue(
    entity.fieldOperatingStatusMoreInfo,
  ),
  fieldPhoneNumber: getDrupalValue(entity.fieldPhoneNumber),
  fieldRegionPage: entity.fieldRegionPage[0]
    ? {
        entity: !ancestors.find(
          r => r.entity.uuid === entity.fieldRegionPage[0].uuid,
        )
          ? entity.fieldRegionPage[0]
          : { title: getDrupalValue(entity.fieldRegionPage[0].title) },
      }
    : null,
  fieldTwitter: getSocialMediaObject(entity.fieldTwitter),
});

module.exports = {
  filter: [
    'title',
    'changed',
    'status',
    'metatag',
    'path',
    'field_address',
    'field_email_subscription',
    'field_facebook',
    'field_facility_hours',
    'field_facility_locator_api_id',
    'field_flickr',
    'field_instagram',
    'field_intro_text',
    'field_local_health_care_service_',
    'field_location_services',
    'field_main_location',
    'field_media',
    'field_mental_health_phone',
    'field_nickname_for_this_facility',
    'field_operating_status_facility',
    'field_operating_status_more_info',
    'field_phone_number',
    'field_region_page',
    'field_twitter',
  ],
  transform,
};
