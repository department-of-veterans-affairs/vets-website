const { getDrupalValue } = require('./helpers');
const moment = require('moment-timezone');

const transform = entity => {
  const {
    fieldDateAndTime,
    fieldSendEmailToSubscribers,
    fieldWysiwyg,
  } = entity;
  return {
    contentModelType: entity.contentModelType,
    entity: {
      entityType: 'paragraph',
      entityBundle: 'situation_update',
			fieldDateAndTime: {
				// Assume the raw data is in UTC
				date: moment
				.tz(getDrupalValue(fieldDateAndTime), 'UTC')
				.format('YYYY-MM-DD HH:mm:ss UTC'),
				value: getDrupalValue(fieldDateAndTime),
			},
      fieldSendEmailToSubscribers: getDrupalValue(fieldSendEmailToSubscribers),
      fieldWysiwyg: getDrupalValue(fieldWysiwyg),
    },
  };
};

module.exports = {
  filter: [
    'field_date_and_time',
    'field_send_email_to_subscribers',
    'field_wysiwyg',
  ],
  transform,
};
