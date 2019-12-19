const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'event',
    title: getDrupalValue(entity.title),
    uid: getDrupalValue(entity.uid),
    changed: getDrupalValue(entity.changed),
    path: getDrupalValue(entity.path),
    fieldAdditionalInformationAbo: getDrupalValue(
      entity.fieldAdditionalInformationAbo,
    ),
    fieldAddress: getDrupalValue(entity.fieldAddress),
    fieldBody: getDrupalValue(entity.fieldBody),
    fieldDate: getDrupalValue(entity.fieldDate),
    fieldDescription: getDrupalValue(entity.fieldDescription),
    fieldEventCost: getDrupalValue(entity.fieldEventCost),
    fieldEventCta: getDrupalValue(entity.fieldEventCta),
    fieldEventRegistrationrequired: getDrupalValue(
      entity.fieldEventRegistrationrequired,
    ),
    fieldFacilityLocation: getDrupalValue(entity.fieldFacilityLocation),
    fieldLink: getDrupalValue(entity.fieldLink),
    fieldLocationHumanreadable: getDrupalValue(
      entity.fieldLocationHumanreadable,
    ),
    fieldMedia: getDrupalValue(entity.fieldMedia),
  },
});
module.exports = {
  filter: [
    'title',
    'uid',
    'changed',
    'path',
    'field_additional_information_abo',
    'field_address',
    'field_body',
    'field_date',
    'field_description',
    'field_event_cost',
    'field_event_cta',
    'field_event_registrationrequired',
    'field_facility_location',
    'field_link',
    'field_location_humanreadable',
    'field_media',
  ],
  transform,
};
