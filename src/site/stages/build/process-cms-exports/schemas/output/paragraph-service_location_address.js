module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['paragraph'] },
    entityBundle: { type: 'string', enum: ['service_location_address'] },
    fieldUseFacilityAddress: { type: 'boolean' },
    fieldClinicName: { type: 'string' },
    fieldBuildingNameNumber: { type: 'string' },
    fieldWingFloorOrRoomNumber: { type: 'string' },
    fieldAddress: { $ref: 'Address' },
  },
  required: [
    'fieldUseFacilityAddress',
    'fieldClinicName',
    'fieldBuildingNameNumber',
    'fieldWingFloorOrRoomNumber',
    'fieldAddress',
  ],
};
