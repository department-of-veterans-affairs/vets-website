const moment = require('moment');
const {
  createMetaTagArray,
  getDrupalValue,
  isPublished,
  utcToEpochTime,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'landing_page',
  title: getDrupalValue(entity.title),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  entityUrl: {
    breadcrumb: [],
    path: entity.path[0].alias,
  },
  entityPublished: isPublished(getDrupalValue(entity.moderationState)),
  fieldAdministration: entity.fieldAdministration[0],
  fieldAlert: entity.fieldAlert[0] || null,
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldLinks: entity.fieldLinks.map(({ title, uri }) => ({
    title,
    url: { path: uri },
  })),
  fieldPageLastBuilt: {
    // Assume the raw data is in UTC
    date: moment
      .tz(getDrupalValue(entity.fieldPageLastBuilt), 'UTC')
      .format('YYYY-MM-DD HH:mm:ss UTC'),
  },
  fieldPlainlanguageDate: getDrupalValue(entity.fieldPlainlanguageDate),
  fieldPromo: entity.fieldPromo[0] || null,
  fieldRelatedLinks: entity.fieldRelatedLinks[0] || null,
  fieldSpokes: entity.fieldSpokes,
  fieldSupportServices: entity.fieldSupportServices,
  fieldTitleIcon: getDrupalValue(entity.fieldTitleIcon),
});

module.exports = {
  filter: [
    'title',
    'changed',
    'path',
    'field_administration',
    'field_alert',
    'field_description',
    'field_intro_text',
    'field_links',
    'field_page_last_built',
    'field_plainlanguage_date',
    'field_promo',
    'field_related_links',
    'field_spokes',
    'field_support_services',
    'field_title_icon',
    'metatag',
    'moderation_state',
  ],
  transform,
};
