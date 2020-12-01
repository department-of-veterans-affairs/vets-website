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
    changed: utcToEpochTime(getDrupalValue(entity.changed)),
    title: getDrupalValue(entity.title),
    fieldIntroTextLimitedHtml: entity.fieldIntroTextLimitedHtml,
    fieldAlertSingle: entity.fieldAlertSingle,
    fieldButtons: entity.fieldButtons,
    fieldButtonsRepeat: entity.fieldButtonsRepeat,
    fieldSteps: entity.fieldSteps,
    fieldContactInformation: entity.fieldContactInformation,
    fieldRelatedBenefitHubs: entity.fieldRelatedBenefitHubs,
    fieldRelatedInformation: entity.fieldRelatedInformation,
    fieldPrimaryCategory: entity.fieldPrimaryCategory,
    fieldOtherCategories: entity.fieldOtherCategories,
    fieldTags: entity.fieldTags,
  };
};

module.exports = {
  filter: [
    'changed',
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
    'metatag',
    'path',
    'status',
    'title',
    'uid',
  ],
  transform,
};
