import React from 'react';
import { Link } from 'react-router-dom';

export default function ScheduleNewAppointment({
  showDirectScheduling,
  showCommunityCare,
  startNewAppointmentFlow,
}) {
  const title = showDirectScheduling
    ? 'Schedule an appointment'
    : 'Request an appointment';

  return (
    <div className="vaos-appts__card">
      {showCommunityCare && (
        <>
          <h2 className="vads-u-font-size--base vads-u-display--inline vads-u-font-family--sans vads-u-margin-y--0">
            {title}
          </h2>{' '}
          at a VA medical center, clinic, approved or community care facility.
        </>
      )}
      {!showCommunityCare && (
        <>
          <h2 className="vads-u-font-size--base vads-u-display--inline vads-u-font-family--sans vads-u-margin-y--0">
            {title}
          </h2>{' '}
          at a VA medical center or clinic.
        </>
      )}
      <br />
      <Link
        id="new-appointment"
        className="usa-button vads-u-font-weight--bold vads-u-font-size--md"
        to="/new-appointment"
        onClick={startNewAppointmentFlow}
      >
        {showDirectScheduling ? 'Schedule appointment' : 'Request appointment'}
      </Link>
    </div>
  );
}
