/* eslint-disable camelcase */

module.exports = {
  $id: 'RawPhone',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      field_phone_extension: { type: 'string' },
      field_phone_label: { type: 'string' },
      field_phone_number: { type: 'string' },
      field_phone_number_type: { type: 'string' },
    },
    required: [
      'field_phone_extension',
      'field_phone_label',
      'field_phone_number',
      'field_phone_number_type',
    ],
  },
};
