import moment from 'moment-timezone';

import { FIELD_NONE_NOTED } from '../constants';

// this function is needed to account for the prescription.trackingList dates coming in this format "Mon, 24 Feb 2025 03:39:11 EST" which is not recognized by momentjs
const convertToISO = dateString => {
  // Regular expression to match the expected date format
  const regex = /^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} [A-Z]{3}$/;
  // Return false if the format is invalid
  if (!regex.test(dateString)) {
    return false;
  }
  // Return false if the date is invalid
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.toISOString();
};

/**
 * @param {*} timestamp
 * @param {*} format momentjs formatting guide found here https://momentjs.com/docs/#/displaying/format/
 * @param {*} noDateMessage message when there is no date being passed
 * @param {*} dateWithMessage message when there is a date being passed, node date will be appended to the end of this message
 * @returns {String} fromatted timestamp
 */
export const dateFormat = (
  timestamp,
  format = null,
  noDateMessage = null,
  dateWithMessage = null,
) => {
  if (!timestamp) {
    return noDateMessage || FIELD_NONE_NOTED;
  }

  const isoTimestamp = convertToISO(timestamp);
  const isoTimeStampOrParamTimestamp = isoTimestamp || timestamp;
  const finalTimestamp = moment
    .tz(isoTimeStampOrParamTimestamp, 'America/New_York')
    .format(format || 'MMMM D, YYYY');

  if (dateWithMessage && finalTimestamp) {
    return `${dateWithMessage}${finalTimestamp}`;
  }

  return finalTimestamp;
};
