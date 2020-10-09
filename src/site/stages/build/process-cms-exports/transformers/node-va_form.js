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
  fieldBenefitCategories: entity.fieldBenefitCategories,
  fieldVaFormAdministration: entity.fieldVaFormAdministration[0],
  fieldVaFormIssueDate: getDrupalValue(entity.fieldVaFormIssueDate),
  fieldVaFormLinkTeasers: entity.fieldVaFormLinkTeasers,
  fieldVaFormName: getDrupalValue(entity.fieldVaFormName),
  fieldVaFormNumber: getDrupalValue(entity.fieldVaFormNumber),
  fieldVaFormNumPages: getDrupalValue(entity.fieldVaFormNumPages),
  fieldVaFormRelatedForms: entity.fieldVaFormRelatedForms.map(n => ({
    entity: {
      fieldVaFormName: n.fieldVaFormName,
      fieldVaFormNumber: n.fieldVaFormNumber,
      fieldVaFormUsage: n.fieldVaFormUsage,
      fieldVaFormUrl: n.fieldVaFormUrl,
    },
  })),
  fieldVaFormRevisionDate: getDrupalValue(entity.fieldVaFormRevisionDate),
  fieldVaFormTitle: getDrupalValue(entity.fieldVaFormTitle),
  fieldVaFormToolIntro: getDrupalValue(entity.fieldVaFormToolIntro),
  fieldVaFormToolUrl: entity.fieldVaFormToolUrl.map(({ uri }) => ({
    url: { path: uri },
  })),
  fieldVaFormType: getDrupalValue(entity.fieldVaFormType),
  fieldVaFormUrl: entity.fieldVaFormUrl.map(({ uri }) => ({
    url: { path: uri },
  })),
  fieldVaFormUsage: entity.fieldVaFormUsage[0] || null,
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
    'field_va_form_link_teasers',
    'field_va_form_name',
    'field_va_form_number',
    'field_va_form_num_pages',
    'field_va_form_related_forms',
    'field_va_form_revision_date',
    'field_va_form_title',
    'field_va_form_tool_intro',
    'field_va_form_tool_url',
    'field_va_form_type',
    'field_va_form_url',
    'field_va_form_usage',
  ],
  transform,
};
