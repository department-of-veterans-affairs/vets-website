const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'person_profile',
  entityUrl: {
    path: entity.path[0].alias,
  },
  title: `${getDrupalValue(entity.fieldNameFirst)} ${getDrupalValue(
    entity.fieldLastName,
  )}`,
  fieldBody: getDrupalValue(entity.fieldBody),
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldEmailAddress: getDrupalValue(entity.fieldEmailAddress),
  fieldLastName: getDrupalValue(entity.fieldLastName),
  fieldMedia: entity.fieldMedia.length > 0 ? entity.fieldMedia[0] : null,
  fieldNameFirst: getDrupalValue(entity.fieldNameFirst),
  fieldOffice: entity.fieldOffice[0]
    ? {
        entity: {
          entityLabel: entity.fieldOffice[0].entity.entityLabel,
          entityType: entity.fieldOffice[0].entity.entityType,
        },
      }
    : null,
  fieldPhoneNumber: getDrupalValue(entity.fieldPhoneNumber),
  fieldSuffix: getDrupalValue(entity.fieldSuffix),
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
