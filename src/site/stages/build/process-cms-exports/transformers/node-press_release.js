const {
  createMetaTagArray,
  getDrupalValue,
  getWysiwygString,
  isPublished,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'press_release',
  title: getDrupalValue(entity.title),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  entityUrl: {
    path: entity.path[0].alias,
  },
  fieldAddress: {
    locality: entity.fieldAddress[0].locality,
    // The things in fieldAddress don't get camelCased
    administrativeArea: entity.fieldAddress[0].administrative_area,
  },
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldOffice: {
    entity: {
      entityLabel: entity.fieldOffice[0].entity.entityLabel,
      fieldPressReleaseBlurb: {
        processed: 'test',
      },
    },
  },
  fieldPdfVersion: getDrupalValue(entity.fieldPdfVersion),
  fieldPressReleaseContact: [
    {
      entity: {
        title: `${entity.fieldPressReleaseContact[0].fieldNameFirst} ${
          entity.fieldPressReleaseContact[0].fieldLastName
        }`,
        fieldDescription: entity.fieldPressReleaseContact[0].fieldDescription,
        fieldPhoneNumber: entity.fieldPressReleaseContact[0].fieldPhoneNumber,
        fieldEmailAddress: entity.fieldPressReleaseContact[0].fieldEmailAddress,
      },
    },
  ],
  fieldPressReleaseDownloads: entity.fieldPressReleaseDownloads,
  fieldPressReleaseFulltext: {
    processed: getWysiwygString(
      getDrupalValue(entity.fieldPressReleaseFulltext),
    ),
  },
  fieldReleaseDate: {
    value: getDrupalValue(entity.fieldReleaseDate),
    date: getDrupalValue(entity.fieldReleaseDate),
  },
  entityPublished: isPublished(getDrupalValue(entity.moderationState)),
});
module.exports = {
  filter: [
    'title',
    'metatag',
    'path',
    'field_address',
    'field_intro_text',
    'field_office',
    'field_pdf_version',
    'field_press_release_contact',
    'field_press_release_downloads',
    'field_press_release_fulltext',
    'field_release_date',
    'moderation_state',
  ],
  transform,
};
