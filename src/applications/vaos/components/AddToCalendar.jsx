/**
 * Shared components used by the VAOS application.
 * @module components
 */
import React from 'react';
import PropTypes from 'prop-types';
import { zonedTimeToUtc, formatInTimeZone } from 'date-fns-tz';
import { addMinutes } from 'date-fns';
import { generateICS } from '../utils/calendar';
import { DATE_FORMAT_STRINGS } from '../utils/constants';

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
  timezone,
  duration,
}) {
  const filename = `${summary.replace(/\s/g, '_')}.ics`;
  const startUtc = zonedTimeToUtc(new Date(startDateTime), timezone);
  const endUtc = addMinutes(startUtc, duration);
  const text = generateICS(summary, description, location, startUtc, endUtc);
  const formattedDate = formatInTimeZone(
    startUtc,
    timezone,
    DATE_FORMAT_STRINGS.friendlyDate,
  );

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
    <div className="vaos-hide-for-print vads-u-margin-left--0p5">
      <va-link
        calendar
        href={`data:text/calendar;charset=utf-8,${encodeURIComponent(text)}`}
        filename={filename}
        aria-label={`Add ${formattedDate} appointment to your calendar`}
        text="Add to calendar"
        data-testid="add-to-calendar-link"
      />
    </div>
  );
}

AddToCalendar.propTypes = {
  description: PropTypes.object.isRequired,
  duration: PropTypes.number.isRequired,
  location: PropTypes.string.isRequired,
  startDateTime: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};
