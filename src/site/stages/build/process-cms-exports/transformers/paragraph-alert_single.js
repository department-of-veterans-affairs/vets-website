// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => {
  return {
    entity: {
      entityType: 'paragraph',
      entityBundle: 'alert_single',
      fieldAlertSelection: getDrupalValue(entity.fieldAlertSelection),
      fieldAlertNonReusableRef: entity.fieldAlertNonReusableRef[0] || null,
      fieldAlertBlockReference: entity.fieldAlertBlockReference[0] || null,
    },
  };
};

module.exports = {
  filter: [
    'field_alert_selection',
    'field_alert_block_reference',
    'field_alert_non_reusable_ref',
  ],
  transform,
};
