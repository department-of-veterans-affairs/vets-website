/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    path: { $ref: 'RawPath' },
    field_body: { $ref: 'GenericNestedString' },
    field_description: { $ref: 'GenericNestedString' },
    field_email_address: { $ref: 'GenericNestedString' },
    field_last_name: { $ref: 'GenericNestedString' },
    field_media: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_name_first: { $ref: 'GenericNestedString' },
    field_office: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_phone_number: { $ref: 'GenericNestedString' },
    field_suffix: { $ref: 'GenericNestedString' },
  },
  required: [
    'path',
    'field_body',
    'field_description',
    'field_email_address',
    'field_last_name',
    'field_media',
    'field_name_first',
    'field_office',
    'field_phone_number',
    'field_suffix',
  ],
};
