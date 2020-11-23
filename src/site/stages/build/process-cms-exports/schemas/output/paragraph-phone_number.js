/* eslint-disable camelcase */

const phoneSchema = require('../common/phone');

module.exports = {
  type: 'object',
  entity: {
    type: 'object',
    properties: phoneSchema.items.properties,
  },
  required: [
    'fieldPhoneExtension',
    'fieldPhoneLabel',
    'fieldPhoneNumber',
    'fieldPhoneNumberType',
  ],
};
