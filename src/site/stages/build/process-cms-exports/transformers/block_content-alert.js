const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'block_content',
    entityBundle: 'alert',
    fieldAlertContent: entity.fieldAlertContent[0],
    fieldAlertDismissable: getDrupalValue(entity.fieldAlertDismissable),
    fieldAlertTitle: getDrupalValue(entity.fieldAlertTitle),
    fieldAlertType: getDrupalValue(entity.fieldAlertType),
    fieldReusability: getDrupalValue(entity.fieldReusability),
  },
});
module.exports = {
  filter: [
    'field_alert_content',
    'field_alert_dismissable',
    'field_alert_title',
    'field_alert_type',
    'field_reusability',
  ],
  transform,
};
