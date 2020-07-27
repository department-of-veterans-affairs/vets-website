const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'va_form',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAdministration: entity.fieldAdministration[0],
  fieldBenefitCategories: entity.fieldBenefitCategories[0],
  fieldVaFormAdministration: entity.fieldVaFormAdministration[0],
  fieldVaFormIssueDate: getDrupalValue(entity.fieldVaFormIssueDate),
  fieldVaFormName: getDrupalValue(entity.fieldVaFormName),
  fieldVaFormNumber: getDrupalValue(entity.fieldVaFormNumber),
  fieldVaFormNumPages: getDrupalValue(entity.fieldVaFormNumPages),
  fieldVaFormRevisionDate: getDrupalValue(entity.fieldVaFormRevisionDate),
  fieldVaFormTitle: getDrupalValue(entity.fieldVaFormTitle),
  fieldVaFormType: getDrupalValue(entity.fieldVaFormType),
  fieldVaFormUrl: entity.fieldVaFormUrl.map(({ title, uri }) => ({
    title,
    url: { path: uri },
  })),
});

module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'metatag',
    'field_administration',
    'field_benefit_categories',
    'field_va_form_administration',
    'field_va_form_issue_date',
    'field_va_form_name',
    'field_va_form_number',
    'field_va_form_num_pages',
    'field_va_form_revision_date',
    'field_va_form_title',
    'field_va_form_type',
    'field_va_form_url',
  ],
  transform,
};
