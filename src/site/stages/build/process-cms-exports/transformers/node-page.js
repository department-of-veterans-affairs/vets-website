const moment = require('moment-timezone');
const { flatten, isEmpty } = require('lodash');

const {
  getDrupalValue,
  utcToEpochTime,
  createMetaTagArray,
} = require('./helpers');

function pageTransform(entity) {
  const {
    title,
    changed,
    fieldIntroText,
    fieldPageLastBuilt,
    fieldAlert,
    fieldDescription,
    moderationState: [{ value: published }],
    metatag: { value: metaTags },
  } = entity;

  const transformed = Object.assign({}, entity, {
    title: getDrupalValue(title),
    entityBundle: 'page',
    entityUrl: {
      path: entity.path[0].alias,
    },
    fieldAdministration: entity.fieldAdministration[0],

    fieldIntroText: getDrupalValue(fieldIntroText),
    fieldDescription: getDrupalValue(fieldDescription),
    changed: utcToEpochTime(getDrupalValue(changed)),
    fieldPageLastBuilt: {
      // Assume the raw data is in UTC
      date: moment
        .tz(getDrupalValue(fieldPageLastBuilt), 'UTC')
        .format('YYYY-MM-DD HH:mm:ss UTC'),
    },
    // fieldPageLastBuilt: new Date(
    //   getDrupalValue(fieldPageLastBuilt),
    // ).toUTCString(),

    entityPublished: published === 'published',
    entityMetaTags: createMetaTagArray(metaTags, 'type'),
  });

  transformed.fieldAlert = !isEmpty(flatten(fieldAlert)) ? fieldAlert[0] : null;

  delete transformed.moderationState;
  delete transformed.metatag;
  delete transformed.path;

  return transformed;
}

module.exports = {
  filter: [
    'field_intro_text',
    'field_description',
    'field_featured_content',
    'field_content_block',
    'field_alert',
    'field_related_links',
    'field_administration',
    'field_page_last_built',
    'metatag',
    'changed',
    'moderation_state',
    'path',
  ],
  transform: pageTransform,
};
