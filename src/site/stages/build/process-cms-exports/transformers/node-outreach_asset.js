const { getDrupalValue } = require('./helpers');

function transform(entity) {
  const {
    changed,
    status,
    title,
    fieldBenefits,
    fieldDescription,
    fieldFormat,
    fieldMedia,
    fieldOffice,
  } = entity;

  const transformed = {
    changed: new Date(changed).getTime() / 1000,
    entityBundle: 'outreach_asset',
    entityId: undefined, // Unsure how to get this as it doesn't appear to be the uuid.
    fieldBenefits: getDrupalValue(fieldBenefits),
    fieldDescription: getDrupalValue(fieldDescription),
    fieldFormat: getDrupalValue(fieldFormat),
    fieldMedia: getDrupalValue(fieldMedia),
    fieldOffice: getDrupalValue(fieldOffice),
    status: getDrupalValue(status),
    title: getDrupalValue(title),
  };

  return transformed;
}

module.exports = transform;
