const moment = require('moment');
const { mapKeys, camelCase } = require('lodash');

const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
  getWysiwygString,
  isPublished,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'press_release',
  // Ignoring this for now as uid is causing issues
  // uid: entity.uid[0],
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  promote: getDrupalValue(entity.promote),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAddress: entity.fieldAddress[0]
    ? mapKeys(entity.fieldAddress[0], (v, k) => camelCase(k))
    : null,
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldOffice:
    entity.fieldOffice && entity.fieldOffice[0]
      ? { entity: entity.fieldOffice[0] }
      : null,
  fieldPdfVersion: entity.fieldPdfVersion[0]
    ? {
        entity: entity.fieldPdfVersion[0],
      }
    : null,
  fieldPressReleaseContact: entity.fieldPressReleaseContact.map(i => ({
    entity: i,
  })),
  fieldPressReleaseDownloads: entity.fieldPressReleaseDownloads,
  fieldPressReleaseFulltext: {
    processed: getWysiwygString(
      getDrupalValue(entity.fieldPressReleaseFulltext),
    ),
  },
  fieldReleaseDate: {
    value: getDrupalValue(entity.fieldReleaseDate),
    date: moment
      .utc(getDrupalValue(entity.fieldReleaseDate))
      .format('YYYY-MM-DD HH:mm:ss z'),
  },
  entityPublished: isPublished(getDrupalValue(entity.status)),
  status: getDrupalValue(entity.status),
});
module.exports = {
  filter: [
    // 'uid',
    'title',
    'created',
    'changed',
    'promote',
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
    'status',
  ],
  transform,
};
