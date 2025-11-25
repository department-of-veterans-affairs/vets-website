import { formatInTimeZone } from 'date-fns-tz';
import guid from 'simple-guid';

const DATE_FORMATS = {
  // Friendly formats for displaying dates to users
  // e.g. January 1, 2023
  friendlyDate: 'MMMM d, yyyy',
  // e.g. Monday, January 1, 2023
  friendlyWeekdayDate: 'EEEE, MMMM d, yyyy',
  // ISO 8601
  // e.g. 2025-05-06T21:00:00
  ISODateTime: "yyyy-MM-dd'T'HH:mm:ss",
  // e.g. 2025-05-06T21:00:00Z
  ISODateTimeUTC: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  // e.g. 2025-05-06T21:00:00-05:00"
  ISODateTimeLocal: "yyyy-MM-dd'T'HH:mm:ssXXX",
  // iCalendar RFC 5545
  // e.g. 20250506T225403
  iCalDateTime: "yyyyMMdd'T'HHmmss",
  // e.g. 20250506T225403Z
  iCalDateTimeUTC: "yyyyMMdd'T'HHmmssXXX",
  // Internal formats for use in source code
  // e.g. 2025-05
  yearMonth: 'yyyy-MM',
  // e.g. 2025-05-21
  yearMonthDay: 'yyyy-MM-dd',
};

/*
 * ICS files have a 75 character line limit. Longer fields need to be broken
 * into 75 character chunks with a CRLF in between. They also apparently need to have a tab
 * character at the start of each new line, which is why I set the limit to 74
 *
 * Additionally, any actual line breaks in the text need to be escaped
 */
const ICS_LINE_LIMIT = 74;

/*
* Format the description for the ICS file.
* @param {string} description - The description to format.
* @returns {string} The formatted description.
*/
function formatDescription(description) {
  if (!description) {
    return 'DESCRIPTION:';
  }
  let text = `DESCRIPTION:${description}`;
  text = text.replace(/\r/g, '').replace(/\n/g, '\\n');

  return text.length > ICS_LINE_LIMIT
    ? text.substring(0, ICS_LINE_LIMIT)
    : text;
}

/*
* Generate the ICS file.
* @param {string} summary - The summary of the event.
* @param {string} description - The description of the event.
* @param {Date} startUtc - The start time of the event.
* @param {Date} endUtc - The end time of the event.
*/
export function generateICS(summary, description, startUtc, endUtc) {
  const startDate = formatInTimeZone(
    startUtc,
    'UTC',
    DATE_FORMATS.iCalDateTimeUTC,
  );
  const endDate = formatInTimeZone(endUtc, 'UTC', DATE_FORMATS.iCalDateTimeUTC);

  return [
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`,
    `PRODID:VA`,
    `BEGIN:VEVENT`,
    `UID:${guid()}`,
    `SUMMARY:${summary}`,
    `${formatDescription(description)}`,
    `LOCATION:Phone call`,
    `DTSTAMP:${startDate}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `END:VEVENT`,
    `END:VCALENDAR`,
  ].join('\r\n');
}
