const {
  createMetaTagArray,
  getDrupalValue,
  isPublished,
  utcToEpochTime,
} = require('./helpers');

const transform = entity => {
  return {
    entityType: 'node',
    entityBundle: 'q_a',
    title: getDrupalValue(entity.title),
    created: utcToEpochTime(getDrupalValue(entity.created)),
    changed: utcToEpochTime(getDrupalValue(entity.changed)),
    entityMetatags: createMetaTagArray(entity.metatag.value),
    entityPublished: isPublished(getDrupalValue(entity.status)),
    fieldAdministration: entity.fieldAdministration[0],
    fieldStandalonePage: getDrupalValue(entity.fieldStandalonePage),
    fieldAlertSingle: {
      entity: entity.fieldAlertSingle[0],
    },
    fieldAnswer: entity.fieldAnswer[0] || null,
    fieldButtons: entity.fieldButtons,
    fieldContactInformation: entity.fieldContactInformation[0],
    fieldOtherCategories: entity.fieldOtherCategories,
    fieldPrimaryCategory: entity.fieldPrimaryCategory[0],
    fieldRelatedBenefitHubs: entity.fieldRelatedBenefitHubs,
    fieldRelatedInformation: entity.fieldRelatedInformation,
    fieldTags: entity.fieldTags,
  };
};

module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'metatag',
    'status',
    'field_administration',
    'field_alert_single',
    'field_answer',
    'field_buttons',
    'field_contact_information',
    'field_other_categories',
    'field_primary_category',
    'field_related_benefit_hubs',
    'field_related_information',
    'field_standalone_page',
    'field_tags',
  ],
  transform,
};
