// Relative imports.
const {
  getDrupalValue,
  utcToEpochTime,
  createMetaTagArray,
  isPublished,
} = require('./helpers');

const transform = entity => {
  return {
    changed: utcToEpochTime(getDrupalValue(entity.changed)),
    entityBundle: 'faq_multiple_q_a',
    entityMetatags: createMetaTagArray(entity.metatag.value),
    entityPublished: isPublished(getDrupalValue(entity.status)),
    entityType: 'node',
    fieldAlertSingle: entity.fieldAlertSingle[0],
    fieldButtons: entity.fieldButtons,
    fieldButtonsRepeat: getDrupalValue(entity.fieldButtonsRepeat),
    fieldContactInformation: entity.fieldContactInformation[0] || null,
    fieldIntroTextLimitedHtml: entity.fieldIntroTextLimitedHtml[0],
    fieldOtherCategories: entity.fieldOtherCategories,
    fieldPrimaryCategory: entity.fieldPrimaryCategory[0] || null,
    fieldQAGroups: entity.fieldQAGroups,
    fieldRelatedBenefitHubs: entity.fieldRelatedBenefitHubs.map(
      nodeLandingPage => {
        return { entity: nodeLandingPage };
      },
    ),
    fieldRelatedInformation: entity.fieldRelatedInformation,
    fieldTags: entity.fieldTags[0],
    title: getDrupalValue(entity.title),
  };
};

module.exports = {
  filter: [
    'changed',
    'created',
    'field_alert_single',
    'field_buttons',
    'field_buttons_repeat',
    'field_contact_information',
    'field_intro_text_limited_html',
    'field_other_categories',
    'field_primary_category',
    'field_q_a_groups',
    'field_related_benefit_hubs',
    'field_related_information',
    'field_tags',
    'metatag',
    'status',
    'title',
  ],
  transform,
};
