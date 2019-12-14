/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_button_format: { $ref: 'GenericNestedBoolean' },
    field_cta_widget: { $ref: 'GenericNestedBoolean' },
    field_default_link: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
          title: { type: 'string' },
          options: { type: 'array' }, // all examples are empty
        },
        required: ['uri', 'title', 'options'],
      },
      maxItems: 1,
    },
    field_error_message: { $ref: 'GenericNestedString' },
    field_loading_message: { $ref: 'GenericNestedString' },
    field_timeout: { $ref: 'GenericNestedNumber' },
    field_widget_type: { $ref: 'GenericNestedString' },
  },
  required: [
    'field_button_format',
    'field_cta_widget',
    'field_default_link',
    'field_error_message',
    'field_loading_message',
    'field_timeout',
    'field_widget_type',
  ],
};
