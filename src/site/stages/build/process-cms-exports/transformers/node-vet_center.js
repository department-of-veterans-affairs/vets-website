const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'vet_center',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAdministration: entity.fieldAdministration[0],
  fieldFacilityLocatorApiId: getDrupalValue(entity.fieldFacilityLocatorApiId),
  fieldOperatingStatusFacility: getDrupalValue(
    entity.fieldOperatingStatusFacility,
  ),
  fieldOperatingStatusMoreInfo: getDrupalValue(
    entity.fieldOperatingStatusMoreInfo,
  ),
});

module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'metatag',
    'field_administration',
    'field_facility_locator_api_id',
    'field_operating_status_facility',
    'field_operating_status_more_info',
  ],
  transform,
};
