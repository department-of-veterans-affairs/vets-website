// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const {
  getDrupalValue,
  utcToEpochTime,
  getWysiwygString,
  createLink,
  createMetaTagArray,
  isPublished,
  getImageCrop,
} = require('./helpers');

const transform = entity => {
  return {
    entityType: 'node',
    entityBundle: 'step_by_step',
    entityMetatags: createMetaTagArray(entity.metatag.value),
    entityPublished: isPublished(getDrupalValue(entity.status)),
    changed: utcToEpochTime(getDrupalValue(entity.changed)),
    title: getDrupalValue(entity.title),
    fieldIntroTextLimitedHtml: entity.fieldIntroTextLimitedHtml[0],
    fieldAlertSingle: entity.fieldAlertSingle[0],
    fieldButtons: entity.fieldButtons,
    fieldButtonsRepeat: getDrupalValue(entity.fieldButtonsRepeat),
    fieldSteps: entity.fieldSteps,
    fieldContactInformation: entity.fieldContactInformation[0] || null,
    fieldRelatedBenefitHubs: entity.fieldRelatedBenefitHubs.map(
      nodeLandingPage => {
        return { entity: nodeLandingPage };
      },
    ),
    fieldRelatedInformation: entity.fieldRelatedInformation,
    fieldPrimaryCategory: entity.fieldPrimaryCategory[0] || null,
    fieldOtherCategories: entity.fieldOtherCategories,
    fieldTags: entity.fieldTags[0],
  };
};

module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'metatag',
    'status',
    'field_alert_single',
    'field_buttons',
    'field_buttons_repeat',
    'field_contact_information',
    'field_intro_text_limited_html',
    'field_other_categories',
    'field_primary_category',
    'field_related_benefit_hubs',
    'field_related_information',
    'field_steps',
    'field_tags',
  ],
  transform,
};
