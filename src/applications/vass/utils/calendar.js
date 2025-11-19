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

function formatDescription(description, location = '') {
  if (!description || !description.text) {
    return 'DESCRIPTION:';
  }

  const chunked = [];
  if (typeof description === 'object') {
    let text = `DESCRIPTION:${description.text}`;
    text = text.replace(/\r/g, '').replace(/\n/g, '\\n');

    while (text.length > ICS_LINE_LIMIT) {
      chunked.push(`${text}\\n`.substring(0, ICS_LINE_LIMIT));
      text = text.substring(ICS_LINE_LIMIT);
    }

    // Add last line of description text
    if (text) {
      chunked.push(text);
    }

    if (description.providerName) {
      chunked.push(`\\n\\n${description.providerName}`);
    }

    if (location) {
      const loc = description.providerName
        ? `\\n${location}`
        : `\\n\\n${location}`;
      const index = loc.indexOf(',');

      if (index !== -1) {
        chunked.push(`${loc.substring(0, index)}\\n`);
        chunked.push(`${loc.substring(index + 1).trimStart()}\\n`);
      } else {
        chunked.push(`${loc}\\n`);
      }
    }

    const phone = description.phone?.replace(/\r/g, '').replace(/\n/g, '\\n');
    if (phone && phone !== 'undefined') {
      chunked.push(`${phone}\\n`);
    }

    if (description.additionalText) {
      description.additionalText.forEach(val => {
        let line = `\\n${val}`;
        while (line.length > ICS_LINE_LIMIT) {
          chunked.push(`${line}\\n`.substring(0, ICS_LINE_LIMIT));
          line = line.substring(ICS_LINE_LIMIT);
        }
        chunked.push(`${line}\\n`);
      });
    }
  }

  return chunked.join('\r\n\t').replace(/,/g, '\\,');
}

export function generateICS(summary, description, location, startUtc, endUtc) {
  const startDate = formatInTimeZone(
    startUtc,
    'UTC',
    DATE_FORMATS.iCalDateTimeUTC,
  );
  const endDate = formatInTimeZone(endUtc, 'UTC', DATE_FORMATS.iCalDateTimeUTC);

  let loc = '';
  if (location) {
    loc = location.replace(/,/g, '\\,');
  }
  return [
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`,
    `PRODID:VA`,
    `BEGIN:VEVENT`,
    `UID:${guid()}`,
    `SUMMARY:${summary}`,
    `${formatDescription(description, location)}`,
    `LOCATION:${summary.startsWith('Phone') ? 'Phone call' : loc}`,
    `DTSTAMP:${startDate}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `END:VEVENT`,
    `END:VCALENDAR`,
  ].join('\r\n');
}
