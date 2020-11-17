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
      fieldDatetimeRangeTimezone:
        entity.fieldDatetimeRangeTimezone &&
        entity.fieldDatetimeRangeTimezone.length
          ? {
              value: entity.fieldDatetimeRangeTimezone[0].value
                ? Date.parse(entity.fieldDatetimeRangeTimezone[0].value) / 1000
                : null,
              endValue: entity.fieldDatetimeRangeTimezone[0].endValue
                ? Date.parse(entity.fieldDatetimeRangeTimezone[0].endValue) /
                  1000
                : null,
              timezone: entity.fieldDatetimeRangeTimezone[0].timezone,
            }
          : {},
      fieldSendEmailToSubscribers: getDrupalValue(fieldSendEmailToSubscribers),
      fieldWysiwyg: {
        processed: fieldWysiwyg[0].processed,
      },
    },
  };
};

module.exports = {
  filter: [
    'field_date_and_time',
    'field_datetime_range_timezone',
    'field_send_email_to_subscribers',
    'field_wysiwyg',
  ],
  transform,
};
