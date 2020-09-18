const {
  getDrupalValue,
  isPublished,
  utcToEpochTime,
  createMetaTagArray,
} = require('./helpers');

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'person_profile',
  title: `${getDrupalValue(entity.fieldNameFirst)} ${getDrupalValue(
    entity.fieldLastName,
  )}`,
  entityMetatags: createMetaTagArray(entity.metatag.value),
  entityPublished: isPublished(getDrupalValue(entity.status)),
  fieldBody: getDrupalValue(entity.fieldBody),
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldEmailAddress: getDrupalValue(entity.fieldEmailAddress),
  fieldLastName: getDrupalValue(entity.fieldLastName),
  fieldMedia:
    entity.fieldMedia && entity.fieldMedia.length > 0
      ? { entity: entity.fieldMedia[0] }
      : null,
  fieldNameFirst: getDrupalValue(entity.fieldNameFirst),
  // If entity.fieldOffice[0] is an ancestor of this entity ignore it
  // entity.fieldOffice[0] would be untransformed, causing errors
  // so we need it transformed here, which will happen in the parent transformer
  /* eslint-disable no-nested-ternary */
  fieldOffice: entity.fieldOffice[0]
    ? ancestors.find(r => r.entity.uuid === entity.fieldOffice[0].uuid) &&
      entity.fieldOffice[0].entityBundle === 'health_care_region_page'
      ? {
          entity: {
            entityLabel: 'VA Pittsburgh health care',
            entityType: 'node',
            entityBundle: 'health_care_region_page',
          },
        }
      : null
    : null,
  // !ancestors.find(r => r.entity.uuid === entity.fieldOffice[0].uuid)
  //   ? {
  //       entity: {
  //         entityLabel: entity.fieldOffice[0].entityLabel,
  //         entityType: entity.fieldOffice[0].entityType,
  //       },
  //     }
  //   : null,
  fieldPhoneNumber: getDrupalValue(entity.fieldPhoneNumber),
  fieldSuffix: getDrupalValue(entity.fieldSuffix),
  // Used for reverse fields in other transformers
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldPhotoAllowHiresDownload: getDrupalValue(
    entity.fieldPhotoAllowHiresDownload,
  ),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  status: getDrupalValue(entity.status),
  fieldCompleteBiography: getDrupalValue(entity.fieldCompleteBiography),
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
    'field_intro_text',
    'field_photo_allow_hires_download',
    'changed',
    'moderation_state',
    'status',
    'metatag',
    'field_complete_biography',
  ],
  transform,
};
