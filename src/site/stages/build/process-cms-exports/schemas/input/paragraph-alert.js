/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_alert_block_reference: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_alert_heading: { $ref: 'GenericNestedString' },
    field_alert_type: { $ref: 'GenericNestedString' },
    field_va_paragraphs: { $ref: 'EntityReferenceArray' },
  },
};
