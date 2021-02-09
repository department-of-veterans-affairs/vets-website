const moment = require('moment-timezone');
const { flatten, isEmpty } = require('lodash');

const {
  getDrupalValue,
  utcToEpochTime,
  createMetaTagArray,
  isPublished,
} = require('./helpers');

const getFieldAlert = fieldAlert => {
  if (!isEmpty(flatten(fieldAlert))) {
    return fieldAlert[0];
  }
  return isEmpty(fieldAlert) ? null : { entity: null };
};

function pageTransform(entity) {
  const {
    title,
    changed,
    fieldPageLastBuilt,
    fieldAlert,
    fieldDescription,
    fieldIntroText,
    fieldTableOfContentsBoolean,
    status,
    metatag: { value: metaTags },
  } = entity;

  const transformed = Object.assign({}, entity, {
    title: getDrupalValue(title),
    entityBundle: 'page',
    fieldAdministration: entity.fieldAdministration[0],
    fieldRelatedLinks: entity.fieldRelatedLinks.length
      ? entity.fieldRelatedLinks[0]
      : null,
    fieldIntroTextLimitedHtml: entity.fieldIntroTextLimitedHtml[0] || null,
    fieldIntroText: getDrupalValue(fieldIntroText),
    fieldDescription: getDrupalValue(fieldDescription),
    fieldTableOfContentsBoolean: getDrupalValue(fieldTableOfContentsBoolean),
    changed: utcToEpochTime(getDrupalValue(changed)),
    fieldPageLastBuilt: fieldPageLastBuilt.length
      ? {
          // Assume the raw data is in UTC
          date: moment
            .tz(getDrupalValue(fieldPageLastBuilt), 'UTC')
            .format('YYYY-MM-DD HH:mm:ss UTC'),
        }
      : null,

    entityPublished: isPublished(getDrupalValue(status)),
    entityMetatags: createMetaTagArray(metaTags),
  });

  transformed.fieldAlert = getFieldAlert(fieldAlert);

  delete transformed.status;
  delete transformed.metatag;
  delete transformed.path;

  return transformed;
}

module.exports = {
  filter: [
    'field_intro_text_limited_html',
    'field_description',
    'field_table_of_contents_boolean',
    'field_featured_content',
    'field_content_block',
    'field_alert',
    'field_related_links',
    'field_administration',
    'field_page_last_built',
    'metatag',
    'changed',
    'status',
    'path',
  ],
  transform: pageTransform,
};
