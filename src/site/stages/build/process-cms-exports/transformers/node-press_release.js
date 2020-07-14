const moment = require('moment');
const { mapKeys, camelCase } = require('lodash');

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
  fieldAddress: entity.fieldAddress[0]
    ? mapKeys(entity.fieldAddress[0], (v, k) => camelCase(k))
    : null,

  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldOffice: (entity.fieldOffice && entity.fieldOffice[0]) || null,
  fieldPdfVersion: entity.fieldPdfVersion[0] || null,
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
