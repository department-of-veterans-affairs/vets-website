import React from 'react';

import {
  getAppointmentTypeHeader,
  getAppointmentDate,
  generateICS,
} from '../utils/appointment';

export default function AddToCalendar({ appointment, facility }) {
  const title = getAppointmentTypeHeader(appointment);
  const filename = `${title.replace(/\s/g, '_')}.ics`;
  const text = generateICS(appointment, facility);

  // IE11 doesn't support the download attribute, so this creates a button
  // and uses an ms blob save api
  if (window.navigator.msSaveOrOpenBlob) {
    const onClick = () => {
      const blob = new Blob([text], { type: 'text/calendar;charset=utf-8;' });
      window.navigator.msSaveOrOpenBlob(blob, filename);
    };

    return (
      <button
        onClick={onClick}
        aria-label={`Add to calendar on ${getAppointmentDate(appointment)}`}
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
      aria-label={`Add to calendar on ${getAppointmentDate(appointment)}`}
      className="va-button-link vads-u-margin-right--4 vads-u-flex--0"
    >
      Add to calendar
    </a>
  );
}
