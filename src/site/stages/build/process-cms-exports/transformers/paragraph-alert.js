const { getDrupalValue } = require('./helpers');

const transform = entity => {
  const {
    fieldAlertHeading,
    fieldAlertType,
    fieldVaParagraphs,
    fieldAlertBlockReference,
  } = entity;
  return {
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

module.exports = transform;
