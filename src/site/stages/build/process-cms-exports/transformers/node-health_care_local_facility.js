/* eslint-disable camelcase */

const {
  getDrupalValue,
  isPublished,
  createMetaTagArray,
  combineItemsInIndexedObject,
  utcToEpochTime,
  getImageCrop,
} = require('./helpers');
const { mapKeys, camelCase } = require('lodash');

const getSocialMediaObject = ({ uri, title }) =>
  uri
    ? {
        url: { path: uri },
        title,
      }
    : null;

const getFieldRegionObject = ({
  title,
  field_related_links,
  field_govdelivery_id_emerg,
  field_govdelivery_id_news,
  field_operating_status,
}) =>
  title
    ? {
        title: getDrupalValue(title),
        fieldRelatedLinks: field_related_links[0],
        fieldGovdeliveryIdEmerg: getDrupalValue(field_govdelivery_id_emerg),
        fieldGovdeliveryIdNews: getDrupalValue(field_govdelivery_id_news),
        fieldOperatingStatus: field_operating_status[0]
          ? getSocialMediaObject(field_operating_status[0])
          : null,
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
  fieldFacilityHours: {
    value: combineItemsInIndexedObject(
      getDrupalValue(entity.fieldFacilityHours),
    ),
  },
  fieldFacilityLocatorApiId: getDrupalValue(entity.fieldFacilityLocatorApiId),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldLocalHealthCareService: entity.fieldLocalHealthCareService.length
    ? entity.fieldLocalHealthCareService.filter(
        s =>
          s.entity?.fieldRegionalHealthService?.entity
            ?.fieldServiceNameAndDescripti?.entity?.name,
      )
    : null,
  fieldLocationServices: entity.fieldLocationServices.length
    ? entity.fieldLocationServices
    : null,
  fieldMainLocation: getDrupalValue(entity.fieldMainLocation),
  fieldMedia:
    entity.fieldMedia && entity.fieldMedia.length
      ? { entity: getImageCrop(entity.fieldMedia[0], '_32MEDIUMTHUMBNAIL') }
      : null,
  fieldMentalHealthPhone: getDrupalValue(entity.fieldMentalHealthPhone),
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
          : getFieldRegionObject(entity.fieldRegionPage[0]),
      }
    : null,
});

module.exports = {
  filter: [
    'title',
    'changed',
    'status',
    'metatag',
    'path',
    'field_address',
    'field_facility_hours',
    'field_facility_locator_api_id',
    'field_intro_text',
    'field_local_health_care_service_',
    'field_location_services',
    'field_main_location',
    'field_media',
    'field_mental_health_phone',
    'field_operating_status_facility',
    'field_operating_status_more_info',
    'field_phone_number',
    'field_region_page',
  ],
  transform,
};
