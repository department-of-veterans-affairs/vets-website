/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_alert_content: { $ref: 'EntityReferenceArray' },
    field_alert_dismissable: { $ref: 'GenericNestedBoolean' },
    field_alert_title: { $ref: 'GenericNestedString' },
    field_alert_type: { $ref: 'GenericNestedString' },
    field_reusability: { $ref: 'GenericNestedString' },
  },
  required: [
    'field_alert_content',
    'field_alert_dismissable',
    'field_alert_title',
    'field_alert_type',
    'field_reusability',
  ],
};
