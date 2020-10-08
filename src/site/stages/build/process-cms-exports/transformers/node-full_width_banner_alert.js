const {
  getDrupalValue,
  createMetaTagArray,
  utcToEpochTime,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'full_width_banner_alert',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  path: getDrupalValue(entity.path),
  status: getDrupalValue(entity.status),
  fieldAdministration: entity.fieldAdministration[0],
  fieldAlertDismissable: getDrupalValue(entity.fieldAlertDismissable),
  fieldAlertEmailUpdatesButton: getDrupalValue(
    entity.fieldAlertEmailUpdatesButton,
  ),
  fieldAlertFindFacilitiesCta: getDrupalValue(
    entity.fieldAlertFindFacilitiesCta,
  ),
  fieldAlertInheritanceSubpages: getDrupalValue(
    entity.fieldAlertInheritanceSubpages,
  ),
  fieldAlertOperatingStatusCta: getDrupalValue(
    entity.fieldAlertOperatingStatusCta,
  ),
  fieldAlertType: getDrupalValue(entity.fieldAlertType),
  fieldBannerAlertComputdvalues: getDrupalValue(
    entity.fieldBannerAlertComputdvalues,
  ),
  fieldBannerAlertVamcs: entity.fieldBannerAlertVamcs.map(n => ({
    entity: {
      fieldOffice: n.fieldOffice,
      entityUrl: n.entityUrl,
    },
  })),
  fieldBody: getDrupalValue(entity.fieldBody),
  fieldOperatingStatusSendemail: getDrupalValue(
    entity.fieldOperatingStatusSendemail,
  ),
  fieldSituationUpdates: entity.fieldSituationUpdates || null,
});

module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'metatag',
    'path',
    'status',
    'field_administration',
    'field_alert_dismissable',
    'field_alert_email_updates_button',
    'field_alert_find_facilities_cta',
    'field_alert_inheritance_subpages',
    'field_alert_operating_status_cta',
    'field_alert_type',
    'field_banner_alert_computdvalues',
    'field_banner_alert_vamcs',
    'field_body',
    'field_operating_status_sendemail',
    'field_situation_updates',
  ],
  transform,
};
