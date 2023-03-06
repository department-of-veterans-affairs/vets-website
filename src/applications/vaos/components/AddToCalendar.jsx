/**
 * Shared components used by the VAOS application.
 * @module components
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import guid from 'simple-guid';
import { ICS_LINE_LIMIT } from '../utils/calendar';

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

/**
 * Component to add a link to download a calendar ics file.
 *
 * @param {string} summary - Calendar event summary.
 * @param {Object} description - Calendar event description.
 * @param {string} description.text - Description text.
 * @param {string} description.providerName - Provider name
 * @param {string} description.phone - Provider phone
 * @param {string} description.additionalText - Additional text
 * @param {string} [location='']
 * @param {string} startDateTime - Calendar event start date
 * @param {string} duration - Calendar event duration.
 */
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
        type="button"
        aria-label={`Add ${formattedDate} appointment to your calendar`}
        className="va-button-link vads-u-margin-right--4 vads-u-flex--0"
      >
        Add to calendar
      </button>
    );
  }

  return (
    <va-link
      calendar
      href={`data:text/calendar;charset=utf-8,${encodeURIComponent(text)}`}
      filename={filename}
      aria-label={`Add ${formattedDate} appointment to your calendar`}
      text="Add to calendar"
      data-testid="add-to-calendar-link"
    />
  );
}

AddToCalendar.propTypes = {
  description: PropTypes.object,
  duration: PropTypes.number,
  location: PropTypes.string,
  startDateTime: PropTypes.string,
  summary: PropTypes.string,
};
