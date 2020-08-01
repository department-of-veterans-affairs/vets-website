/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_alert_block_reference: { $ref: 'EntityReferenceArray' },
    field_alert_heading: { $ref: 'GenericNestedString' },
    field_alert_type: { $ref: 'GenericNestedString' },
    field_va_paragraphs: { $ref: 'EntityReferenceArray' },
  },
};
