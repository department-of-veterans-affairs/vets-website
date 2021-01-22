const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'phone_number',
  fieldPhoneExtension: getDrupalValue(entity.fieldPhoneExtension),
  fieldPhoneLabel: getDrupalValue(entity.fieldPhoneLabel),
  fieldPhoneNumber: getDrupalValue(entity.fieldPhoneNumber),
  fieldPhoneNumberType: getDrupalValue(entity.fieldPhoneNumberType),
});

module.exports = {
  filter: [
    'field_phone_extension',
    'field_phone_label',
    'field_phone_number',
    'field_phone_number_type',
  ],
  transform,
};
