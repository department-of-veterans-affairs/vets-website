const { getDrupalValue } = require('./helpers');

const transform = entity => {
  const {
    fieldAlertHeading,
    fieldAlertType,
    fieldVaParagraphs,
    fieldAlertBlockReference,
  } = entity;
  return {
    contentModelType: entity.contentModelType,
    entity: {
      entityType: 'paragraph',
      entityBundle: 'alert',
      fieldAlertType: getDrupalValue(fieldAlertType),
      fieldAlertHeading: getDrupalValue(fieldAlertHeading),
      fieldVaParagraphs: fieldVaParagraphs.length ? fieldVaParagraphs : [],
      fieldAlertBlockReference: fieldAlertBlockReference?.[0] || null,
    },
  };
};

module.exports = {
  filter: [
    'field_alert_block_reference',
    'field_alert_heading',
    'field_alert_type',
    'field_va_paragraphs',
  ],
  transform,
};
