const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'landing_page',
    title: getDrupalValue(entity.title),
    changed: getDrupalValue(entity.changed),
    path: getDrupalValue(entity.path),
    fieldAdministration: getDrupalValue(entity.fieldAdministration),
    fieldAlert: getDrupalValue(entity.fieldAlert),
    fieldDescription: getDrupalValue(entity.fieldDescription),
    fieldIntroText: getDrupalValue(entity.fieldIntroText),
    fieldLinks: getDrupalValue(entity.fieldLinks),
    fieldPageLastBuilt: getDrupalValue(entity.fieldPageLastBuilt),
    fieldPlainlanguageDate: getDrupalValue(entity.fieldPlainlanguageDate),
    fieldPromo: getDrupalValue(entity.fieldPromo),
    fieldRelatedLinks: getDrupalValue(entity.fieldRelatedLinks),
    fieldSpokes: getDrupalValue(entity.fieldSpokes),
    fieldSupportServices: getDrupalValue(entity.fieldSupportServices),
    fieldTitleIcon: getDrupalValue(entity.fieldTitleIcon),
  },
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
  ],
  transform,
};
