const { getDrupalValue } = require('./helpers');
const { mapKeys, camelCase } = require('lodash');

const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'service_location_address',
  fieldBuildingNameNumber: getDrupalValue(entity.fieldBuildingNameNumber),
  fieldClinicName: getDrupalValue(entity.fieldClinicName),
  fieldUseFacilityAddress: getDrupalValue(entity.fieldUseFacilityAddress),
  fieldWingFloorOrRoomNumber: getDrupalValue(entity.fieldWingFloorOrRoomNumber),
  fieldAddress: entity.fieldAddress[0]
    ? mapKeys(entity.fieldAddress[0], (v, k) => camelCase(k))
    : null,
});

module.exports = {
  filter: [
    'field_use_facility_address',
    'field_clinic_name',
    'field_building_name_number',
    'field_wing_floor_or_room_number',
    'field_address',
  ],
  transform,
};
