/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  require: [
    'field_additional_contact',
    'field_benefit_hub_contacts',
    'field_contact_default',
    'field_contact_info_switch',
  ],
  properties: {
    field_additional_contact: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_benefit_hub_contacts: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_contact_default: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_contact_info_switch: { $ref: 'GenericNestedString' },
  },
};
