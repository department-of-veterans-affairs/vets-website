import React from 'react';
import moment from 'moment';

import { PURPOSE_TEXT } from '../utils/constants';
import { generateICS } from '../utils/appointment';

export default function AddToCalendar({
  summary,
  description,
  location,
  startDateTime,
  duration,
}) {
  const instructions = PURPOSE_TEXT.some(purpose =>
    description.startsWith(purpose.short),
  )
    ? description
    : '';

  const filename = `${summary.replace(/\s/g, '_')}.ics`;
  const text = generateICS(
    summary,
    instructions,
    location,
    startDateTime,
    moment(startDateTime)
      .add(duration, 'minutes')
      .toDate(),
  );
  const formattedDate = moment(startDateTime).format('MMMM D, YYYY');

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
