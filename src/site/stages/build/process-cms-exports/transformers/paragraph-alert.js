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
      fieldVaParagraphs: fieldVaParagraphs.length ? fieldVaParagraphs : null,
      fieldAlertBlockReference: fieldAlertBlockReference.length
        ? fieldAlertBlockReference
        : null,
    },
  };
};

module.exports = {
  filter: [
    'field_alert_type',
    'field_alert_heading',
    'field_va_paragraphs',
    'field_alert_block_reference',
  ],
  transform,
};
