const { get } = require('lodash');

const transform = entity => {
  const modifiedEntity = {};

  // Derive the raw entity properties.
  const changed = get(entity, 'changed[0].value');
  const status = get(entity, 'status[0].value');
  const title = get(entity, 'title[0].value');
  const fieldBenefits = get(entity, 'field_benefits[0].value');
  const fieldDescription = get(entity, 'field_description[0].value');
  const fieldFormat = get(entity, 'field_format[0].value');

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
