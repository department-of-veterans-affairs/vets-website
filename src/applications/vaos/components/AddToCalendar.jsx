/**
 * Shared components used by the VAOS application.
 * @module components
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { generateICS } from '../utils/calendar';

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
  description: PropTypes.object,
  duration: PropTypes.number,
  location: PropTypes.string,
  startDateTime: PropTypes.string,
  summary: PropTypes.string,
};
