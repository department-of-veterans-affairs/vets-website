/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  require: ['field_button_label', 'field_button_label'],
  properties: {
    field_button_label: { $ref: 'GenericNestedString' },
    field_button_link: {
      required: ['uri', 'title', 'options'],
      properties: {
        uri: { type: 'string' },
        title: { type: 'string' },
        options: { type: 'array' },
      },
    },
  },
};
