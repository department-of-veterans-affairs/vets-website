import moment from './moment-tz';
import guid from 'simple-guid';
import environment from 'platform/utilities/environment';
import {
  APPOINTMENT_TYPES,
  PURPOSE_TEXT,
  VIDEO_TYPES,
  APPOINTMENT_STATUS,
  CANCELLED_APPOINTMENT_SET,
  FUTURE_APPOINTMENTS_HIDDEN_SET,
  PAST_APPOINTMENTS_HIDDEN_SET,
  PAST_APPOINTMENTS_HIDE_STATUS_SET,
  FUTURE_APPOINTMENTS_HIDE_STATUS_SET,
  EXPRESS_CARE,
} from './constants';

import {
  getTimezoneBySystemId,
  getTimezoneAbbrBySystemId,
  getTimezoneDescFromAbbr,
  stripDST,
} from './timezone';

export function getRealFacilityId(facilityId) {
  if (!environment.isProduction() && facilityId) {
    return facilityId.replace('983', '442').replace('984', '552');
  }

  return facilityId;
}

/**
 * Date and time
 */

export function getAppointmentTimezoneAbbreviation(timezone, facilityId) {
  if (facilityId) {
    return getTimezoneAbbrBySystemId(facilityId);
  }

  const tzAbbr = timezone?.split(' ')?.[1] || timezone;
  return stripDST(tzAbbr);
}

export function getAppointmentTimezoneDescription(timezone, facilityId) {
  const abbr = getAppointmentTimezoneAbbreviation(timezone, facilityId);

  return getTimezoneDescFromAbbr(abbr);
}

export function getPastAppointmentDateRangeOptions(today = moment()) {
  const startOfToday = today.startOf('day');
  // Past 3 months
  const options = [
    {
      value: 0,
      label: 'Past 3 months',
      startDate: startOfToday
        .clone()
        .subtract(3, 'months')
        .format(),
      endDate: today.format(),
    },
  ];

  // 3 month ranges going back ~1 year
  let index = 1;
  let monthsToSubtract = 3;

  while (index < 4) {
    const start = startOfToday
      .clone()
      .subtract(index === 1 ? 5 : monthsToSubtract + 2, 'months')
      .startOf('month');
    const end = startOfToday
      .clone()
      .subtract(index === 1 ? 3 : monthsToSubtract, 'months')
      .endOf('month');

    options.push({
      value: index,
      label: `${start.format('MMM YYYY')} – ${end.format('MMM YYYY')}`,
      startDate: start.format(),
      endDate: end.format(),
    });

    monthsToSubtract += 3;
    index += 1;
  }

  // All of current year
  options.push({
    value: 4,
    label: `All of ${startOfToday.format('YYYY')}`,
    startDate: startOfToday
      .clone()
      .startOf('year')
      .format(),
    endDate: startOfToday.format(),
  });

  // All of last year
  const lastYear = startOfToday.clone().subtract(1, 'years');

  options.push({
    value: 5,
    label: `All of ${lastYear.format('YYYY')}`,
    startDate: lastYear.startOf('year').format(),
    endDate: lastYear
      .clone()
      .endOf('year')
      .format(),
  });

  return options;
}

/*
 * ICS files have a 75 character line limit. Longer fields need to be broken
 * into 75 character chunks with a CRLF in between. They also apparenly need to have a tab
 * character at the start of each new line, which is why I set the limit to 74
 * 
 * Additionally, any actual line breaks in the text need to be escaped
 */
const ICS_LINE_LIMIT = 74;
function formatDescription(description) {
  if (!description) {
    return description;
  }

  const descWithEscapedBreaks = description
    .replace(/\r/g, '')
    .replace(/\n/g, '\\n');

  const chunked = [];
  let restOfDescription = `DESCRIPTION:${descWithEscapedBreaks}`;
  while (restOfDescription.length > ICS_LINE_LIMIT) {
    chunked.push(restOfDescription.substring(0, ICS_LINE_LIMIT));
    restOfDescription = restOfDescription.substring(ICS_LINE_LIMIT);
  }
  chunked.push(restOfDescription);

  return chunked.join('\r\n\t');
}
/**
 * Function to generate ICS.
 *
 * @param {String} summary - summary or subject of invite
 * @param {String} description - additional detials
 * @param {Object} location - address / location
 * @param {Date} startDateTime - start datetime in js date format
 * @param {Date} endDateTime - end datetime in js date format
 */
export function generateICS(
  summary,
  description,
  location,
  startDateTime,
  endDateTime,
) {
  const startDate = moment(startDateTime).format('YYYYMMDDTHHmmss');
  const endDate = moment(endDateTime).format('YYYYMMDDTHHmmss');
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:VA
BEGIN:VEVENT
UID:${guid()}
SUMMARY:${summary}
${formatDescription(description)}
LOCATION:${location}
DTSTAMP:${startDate}
DTSTART:${startDate}
DTEND:${endDate}
END:VEVENT
END:VCALENDAR`;
}

export function getCernerPortalLink() {
  if (environment.isProduction()) {
    return 'http://patientportal.myhealth.va.gov/';
  }

  return 'http://ehrm-va-test.patientportal.us.healtheintent.com/';
}
