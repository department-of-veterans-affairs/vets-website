const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'person_profile',
    path: getDrupalValue(entity.path),
    fieldBody: getDrupalValue(entity.fieldBody),
    fieldDescription: getDrupalValue(entity.fieldDescription),
    fieldEmailAddress: getDrupalValue(entity.fieldEmailAddress),
    fieldLastName: getDrupalValue(entity.fieldLastName),
    fieldMedia: getDrupalValue(entity.fieldMedia),
    fieldNameFirst: getDrupalValue(entity.fieldNameFirst),
    fieldOffice: getDrupalValue(entity.fieldOffice),
    fieldPhoneNumber: getDrupalValue(entity.fieldPhoneNumber),
    fieldSuffix: getDrupalValue(entity.fieldSuffix),
  },
});
module.exports = {
  filter: [
    'path',
    'field_body',
    'field_description',
    'field_email_address',
    'field_last_name',
    'field_media',
    'field_name_first',
    'field_office',
    'field_phone_number',
    'field_suffix',
  ],
  transform,
};
