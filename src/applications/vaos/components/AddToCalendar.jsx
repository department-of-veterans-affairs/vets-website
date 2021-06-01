import React from 'react';
import moment from 'moment';
import guid from 'simple-guid';

/*
 * ICS files have a 75 character line limit. Longer fields need to be broken
 * into 75 character chunks with a CRLF in between. They also apparenly need to have a tab
 * character at the start of each new line, which is why I set the limit to 74
 * 
 * Additionally, any actual line breaks in the text need to be escaped
 */
const ICS_LINE_LIMIT = 74;

function formatDescription(description, location = '') {
  if (!description) {
    return description;
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

function generateICS(
  summary,
  description,
  location,
  startDateTime,
  endDateTime,
) {
  const startDate = moment(startDateTime)
    .utc()
    .format('YYYYMMDDTHHmmss[Z]');
  const endDate = moment(endDateTime)
    .utc()
    .format('YYYYMMDDTHHmmss[Z]');
  return [
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`,
    `PRODID:VA`,
    `BEGIN:VEVENT`,
    `UID:${guid()}`,
    `SUMMARY:${summary}`,
    `${formatDescription(description, location)}`,
    `LOCATION:${
      summary.startsWith('Phone')
        ? 'Phone call'
        : location?.replace(/,/g, '\\,')
    }`,
    `DTSTAMP:${startDate}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `END:VEVENT`,
    `END:VCALENDAR`,
  ].join('\r\n');
}

export function getICSTokens(buffer) {
  const map = new Map();
  let tokens = buffer.split('\r\n');

  // Split tokens into key/value pairs
  tokens = tokens.map(t => t.split(':'));

  tokens.forEach(token => {
    // Store duplicate keys values in an array...
    if (map.has(token[0])) {
      const value = map.get(token[0]);
      if (Array.isArray(value)) {
        value.push(token[1]);
      } else {
        map.set(token[0], [value, token[1]]);
      }
    } else if (token[0].startsWith('\t')) {
      map.set('FORMATTED_TEXT', token[0]);
    } else {
      map.set(token[0], token[1]);
    }
  });
  console.log(map);
  return map;
}

export default function AddToCalendar({
  summary = '',
  description,
  location,
  startDateTime,
  duration,
}) {
  const filename = `${summary.replace(/\s/g, '_')}.ics`;
  const text = generateICS(
    summary,
    description,
    location,
    startDateTime,
    moment(startDateTime).add(duration, 'minutes'),
  );
  const formattedDate = moment.parseZone(startDateTime).format('MMMM D, YYYY');

  // IE11 doesn't support the download attribute, so this creates a button
  // and uses an ms blob save api
  if (window.navigator.msSaveOrOpenBlob) {
    const onClick = () => {
      const blob = new Blob([text], {
        type: 'text/calendar;charset=utf-8;',
      });
      window.navigator.msSaveOrOpenBlob(blob, filename);
    };

    return (
      <button
        onClick={onClick}
        aria-label={`Add ${formattedDate} appointment to your calendar`}
        className="va-button-link vads-u-margin-right--4 vads-u-flex--0"
      >
        Add to calendar
      </button>
    );
  }

  return (
    <a
      href={`data:text/calendar;charset=utf-8,${encodeURIComponent(text)}`}
      download={filename}
      aria-label={`Add ${formattedDate} appointment to your calendar`}
      className="va-button-link vads-u-margin-right--4 vads-u-flex--0"
    >
      Add to calendar
    </a>
  );
}
