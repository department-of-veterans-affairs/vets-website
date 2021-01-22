const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'service_location',
  fieldServiceLocationAddress: {
    entity: entity.fieldServiceLocationAddress[0],
  },
  fieldEmailContacts: entity.fieldEmailContacts
    ? entity.fieldEmailContacts.map(emailContactData => ({
        entity: {
          fieldEmailLabel: getDrupalValue(emailContactData.fieldEmailLabel),
          fieldEmailAddress: getDrupalValue(emailContactData.fieldEmailAddress),
        },
      }))
    : null,
  fieldFacilityServiceHours: entity.fieldFacilityServiceHours[0],
  fieldHours: getDrupalValue(entity.fieldHours),
  fieldAdditionalHoursInfo: getDrupalValue(entity.fieldAdditionalHoursInfo),
  fieldPhone: entity.fieldPhone
    ? entity.fieldPhone.map(phoneData => ({
        entity: {
          fieldPhoneExtension: phoneData.fieldPhoneExtension,
          fieldPhoneLabel: phoneData.fieldPhoneLabel,
          fieldPhoneNumber: phoneData.fieldPhoneNumber,
          fieldPhoneNumberType: phoneData.fieldPhoneNumberType,
        },
      }))
    : null,
  fieldUseMainFacilityPhone: getDrupalValue(entity.fieldUseMainFacilityPhone),
});

module.exports = {
  filter: [
    'field_service_location_address',
    'field_email_contacts',
    'field_facility_service_hours',
    'field_hours',
    'field_additional_hours_info',
    'field_phone',
    'field_use_main_facility_phone',
  ],
  transform,
};
