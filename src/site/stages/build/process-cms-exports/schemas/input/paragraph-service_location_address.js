/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_building_name_number: { $ref: 'GenericNestedString' },
    field_clinic_name: { $ref: 'GenericNestedString' },
    field_use_facility_address: { $ref: 'GenericNestedBoolean' },
    field_wing_floor_or_room_number: { $ref: 'GenericNestedString' },
    field_address: { $ref: 'RawAddress' },
  },
  required: [
    'field_use_facility_address',
    'field_clinic_name',
    'field_building_name_number',
    'field_wing_floor_or_room_number',
    'field_address',
  ],
};
