// Relative imports.
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'media',
  entityBundle: 'document_external',
  name: getDrupalValue(entity.name),
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldMediaExternalFile: entity.fieldMediaExternalFile[0],
  fieldMediaInLibrary: getDrupalValue(entity.fieldMediaInLibrary),
  fieldMimeType: getDrupalValue(entity.fieldMimeType),
  fieldOwner: entity.fieldOwner[0],
});

module.exports = {
  filter: [
    'name',
    'field_description',
    'field_media_external_file',
    'field_media_in_library',
    'field_mime_type',
    'field_owner',
  ],
  transform,
};
