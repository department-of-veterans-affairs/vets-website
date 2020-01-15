const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'press_release',
    title: getDrupalValue(entity.title),
    path: getDrupalValue(entity.path),
    fieldAddress: getDrupalValue(entity.fieldAddress),
    fieldIntroText: getDrupalValue(entity.fieldIntroText),
    fieldOffice: getDrupalValue(entity.fieldOffice),
    fieldPdfVersion: getDrupalValue(entity.fieldPdfVersion),
    fieldPressReleaseContact: getDrupalValue(entity.fieldPressReleaseContact),
    fieldPressReleaseDownloads: getDrupalValue(
      entity.fieldPressReleaseDownloads,
    ),
    fieldPressReleaseFulltext: getDrupalValue(entity.fieldPressReleaseFulltext),
    fieldReleaseDate: getDrupalValue(entity.fieldReleaseDate),
  },
});
module.exports = {
  filter: [
    'title',
    'path',
    'field_address',
    'field_intro_text',
    'field_office',
    'field_pdf_version',
    'field_press_release_contact',
    'field_press_release_downloads',
    'field_press_release_fulltext',
    'field_release_date',
  ],
  transform,
};
