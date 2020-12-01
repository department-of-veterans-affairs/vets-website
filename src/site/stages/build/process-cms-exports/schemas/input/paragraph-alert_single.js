/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  require: [
    'field_alert_block_reference',
    'field_alert_non_reusable_ref',
    'field_alert_selection',
  ],
  properties: {
    field_alert_block_reference: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_alert_non_reusable_ref: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_alert_selection: { $ref: 'GenericNestedString' },
  },
};
