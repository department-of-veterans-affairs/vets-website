/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_service_location_address: { $ref: 'EntityReferenceArray' },
    field_email_contacts: {
      type: 'array',
      items: {
        field_email_address: { $ref: 'GenericNestedString' },
        field_email_label: { $ref: 'GenericNestedString' },
      },
    },
    field_facility_service_hours: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'array' },
        },
        maxItems: 1,
      },
    },
    field_hours: { $ref: 'GenericNestedString' },
    field_additional_hours_info: { $ref: 'GenericNestedString' },
    field_phone: { $ref: 'EntityReferenceArray' },
    field_use_main_facility_phone: { $ref: 'GenericNestedBoolean' },
  },
  required: [
    'field_service_location_address',
    'field_email_contacts',
    'field_facility_service_hours',
    'field_hours',
    'field_additional_hours_info',
    'field_use_main_facility_phone',
    'field_phone',
  ],
};
