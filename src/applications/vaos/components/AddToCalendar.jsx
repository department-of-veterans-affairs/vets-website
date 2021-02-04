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
    `${formatDescription(description)}`,
    `LOCATION:${location?.replace(/,/g, '\\,')}`,
    `DTSTAMP:${startDate}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `END:VEVENT`,
    `END:VCALENDAR`,
  ].join('\r\n');
}

export default function AddToCalendar({
  summary,
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
