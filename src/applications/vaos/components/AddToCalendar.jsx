import React from 'react';

import {
  getAppointmentTypeHeader,
  getAppointmentDate,
  generateICS,
} from '../utils/appointment';

export default class AddToCalendar extends React.Component {
  render() {
    const { appointment, facility } = this.props;

    const title = getAppointmentTypeHeader(appointment);
    const filename = `${title.replace(/\s/g, '_')}.ics`;

    const text = generateICS(appointment, facility);
    return (
      <a
        href={`data:text/calendar;charset=utf8,${encodeURIComponent(text)}`}
        download={filename}
        aria-label="Add to calendar on"
        className="va-button-link  vads-u-margin-right--4 vads-u-flex--0"
      >
        Add to calendar
        <span className="sr-only"> on {getAppointmentDate(appointment)}</span>
      </a>
    );
  }
}
