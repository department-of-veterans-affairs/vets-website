/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_date_and_time: { $ref: 'GenericNestedString' },
    field_datetime_range_timezone: { $ref: 'GenericNestedString' },
    field_send_email_to_subscribers: { $ref: 'GenericNestedBoolean' },
    field_wysiwyg: { $ref: 'GenericNestedString' },
  },
  required: [
    'field_date_and_time',
    'field_datetime_range_timezone',
    'field_send_email_to_subscribers',
    'field_wysiwyg',
  ],
};
