const {
  createMetaTagArray,
  getDrupalValue,
  isPublished,
  utcToEpochTime,
} = require('./helpers');

const moment = require('moment');

function toUtc(dateString) {
  const date = moment.utc(dateString);
  return date.format('YYYY-MM-DD 12:00:00 [UTC]');
}

const transform = (entity, { ancestors }) => ({
  targetId: getDrupalValue(entity.nid),
  entityType: 'node',
  entityBundle: 'va_form',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  entityPublished: isPublished(getDrupalValue(entity.status)),
  fieldAdministration: entity.fieldAdministration[0],
  fieldAlert: entity.fieldAlert.length ? entity.fieldAlert[0] : null,
  fieldBenefitCategories: entity.fieldBenefitCategories.map(
    ({ fieldHomePageHubLabel, targetId }) => ({
      targetId,
      entity: { fieldHomePageHubLabel },
    }),
  ),
  fieldVaFormAdministration: entity.fieldVaFormAdministration[0],
  fieldVaFormIssueDate: entity.fieldVaFormIssueDate.length
    ? {
        ...entity.fieldVaFormIssueDate[0],
        date: toUtc(getDrupalValue(entity.fieldVaFormIssueDate)),
      }
    : null,
  fieldVaFormLinkTeasers: entity.fieldVaFormLinkTeasers.map(teaser => ({
    entity: {
      fieldLink: teaser.entity.fieldLink,
      fieldLinkSummary: teaser.entity.fieldLinkSummary,
      entityLabel: `${getDrupalValue(entity.title)} > Helpful links`,
      entityId: teaser.entityId,
      parentFieldName: teaser.entity.parentFieldName,
    },
  })),
  fieldVaFormName: getDrupalValue(entity.fieldVaFormName),
  fieldVaFormNumber: getDrupalValue(entity.fieldVaFormNumber),
  fieldVaFormNumPages: getDrupalValue(entity.fieldVaFormNumPages),
  fieldVaFormRelatedForms: entity.fieldVaFormRelatedForms.map(e => ({
    targetId: e.targetId || getDrupalValue(e.nid),
    entity: !ancestors.find(r => r.entity.uuid === e.uuid)
      ? {
          fieldVaFormName: e.fieldVaFormName,
          fieldVaFormNumber: e.fieldVaFormNumber,
          fieldVaFormUsage: e.fieldVaFormUsage,
          fieldVaFormUrl: e.fieldVaFormUrl,
        }
      : {
          fieldVaFormName: getDrupalValue(e.field_va_form_name),
          fieldVaFormNumber: getDrupalValue(e.field_va_form_number),
          fieldVaFormUsage: e.field_va_form_usage[0] || null,
          fieldVaFormUrl: e.field_va_form_url[0] || null,
        },
  })),
  fieldVaFormRevisionDate: entity.fieldVaFormRevisionDate.length
    ? {
        ...entity.fieldVaFormRevisionDate[0],
        date: toUtc(getDrupalValue(entity.fieldVaFormRevisionDate)),
      }
    : null,
  fieldVaFormTitle: getDrupalValue(entity.fieldVaFormTitle),
  fieldVaFormToolIntro: getDrupalValue(entity.fieldVaFormToolIntro),
  fieldVaFormToolUrl: entity.fieldVaFormToolUrl[0] || null,
  fieldVaFormType: getDrupalValue(entity.fieldVaFormType),
  fieldVaFormUrl: entity.fieldVaFormUrl[0] || null,
  fieldVaFormUsage: entity.fieldVaFormUsage[0] || null,
});

module.exports = {
  filter: [
    'nid',
    'title',
    'created',
    'changed',
    'metatag',
    'status',
    'field_administration',
    'field_alert',
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
