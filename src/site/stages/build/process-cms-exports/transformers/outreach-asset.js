const { getDrupalValue } = require('./helpers');

const transform = entity => {
  const {
    changed,
    status,
    title,
    fieldBenefits,
    fieldDescription,
    fieldFormat,
  } = entity;

  const modifiedEntity = {};

  // Derive the raw entity properties.
  modifiedEntity.changed = getDrupalValue(changed);
  modifiedEntity.status = getDrupalValue(status);
  modifiedEntity.title = getDrupalValue(title);
  modifiedEntity.fieldBenefits = getDrupalValue(fieldBenefits);
  modifiedEntity.fieldDescription = getDrupalValue(fieldDescription);
  modifiedEntity.fieldFormat = getDrupalValue(fieldFormat);

  // Add changed.
  modifiedEntity.changed = new Date(changed).getTime() / 1000;

  // Add entityBundle.
  modifiedEntity.entityBundle = 'outreach-asset';

  // Add remaining entity properties.
  modifiedEntity.status = status;
  modifiedEntity.title = title;
  modifiedEntity.fieldBenefits = fieldBenefits;
  modifiedEntity.fieldDescription = fieldDescription;
  modifiedEntity.fieldFormat = fieldFormat;

  return modifiedEntity;
};

module.exports = transform;
